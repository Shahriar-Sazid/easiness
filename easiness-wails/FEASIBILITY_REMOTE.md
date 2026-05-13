# Remote Connectivity — Feasibility Analysis

## Goal

Allow the same Easiness data to be accessed from a browser (web version) and from the
desktop app (Wails), with bidirectional sync and full offline support.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ User A — Windows PC                                              │
│  ┌────────────────────────────┐                                  │
│  │  Wails Desktop App         │                                  │
│  │  SQLite (local)            │◄──── offline-first writes        │
│  │  ULID sync log             │                                  │
│  └────────────┬───────────────┘                                  │
│               │ push/pull (when online)                          │
└───────────────┼─────────────────────────────────────────────────┘
                │
        ┌───────┴────────┐
        │  Easiness API  │   cmd/server/  — Go + Echo + PostgreSQL
        │  HTTP REST     │
        └───────┬────────┘
                │
┌───────────────┼─────────────────────────────────────────────────┐
│ User B — Browser (any device)                                    │
│  ┌────────────┴───────────────┐                                  │
│  │  Svelte Web App            │                                  │
│  │  Same components           │                                  │
│  │  Calls HTTP API            │                                  │
│  └────────────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key principle: one codebase, two transports

The same `internal/service/` packages power both the desktop (called directly by Wails)
and the server (wrapped in HTTP handlers). No business logic is duplicated.

The Svelte frontend runs identically in the Wails window and in a browser. The only
difference is how it calls the backend: via Wails JS bindings in the desktop, or via
`fetch()` to the HTTP API in the browser.

---

## Sync Identity — ULID

Every record gets a **ULID** (`sync_id`) alongside the existing integer primary key.

```
ULID = 26-character base32 string, 128-bit
       ├── 48 bits = millisecond timestamp (first 10 chars)
       └── 80 bits = cryptographically random (last 16 chars)

Example:  01HX3KPBZG7Y8MWCNQ4RFDA5TV
```

**Why ULID over UUID:**

| Property | UUID v4 | ULID |
|----------|---------|------|
| Globally unique | ✅ | ✅ |
| Time-ordered | ❌ | ✅ |
| Sync cursor: `WHERE id > last` | ❌ (random) | ✅ (monotonic) |
| URL-safe (no hyphens) | ❌ | ✅ |
| Embedded timestamp | ❌ | ✅ |

The ULID is the only identity used in the sync protocol. Integer IDs are local-only
and never cross device boundaries.

### Sync cursor

```
Last sync: client stored cursor = "01HX3KPBZG..."
Next pull: GET /api/sync/pull?cursor=01HX3KPBZG...&device=<device_id>
Server:    SELECT * FROM sync_log WHERE id > '01HX3KPBZG...' ORDER BY id
```

No sequence numbers, no timestamps in separate columns — the ULID IS the cursor.

---

## What gets synced

| Table | Sync strategy | Conflict resolution |
|-------|--------------|---------------------|
| Account | bidirectional | last-write-wins by SyncLog ULID |
| People + ContactNo | bidirectional | last-write-wins |
| Product | bidirectional | last-write-wins |
| Place | bidirectional | last-write-wins |
| Unit / UnitConversion | server → client (seed data) | server wins |
| Document + DocumentItem | append-only (no edits) | no conflict possible |
| Tx | append-only | no conflict possible |
| Stock | server recomputes from Tx/Document | server is authoritative |
| LocalAuth | local-only | not synced |
| StoredLicense | local-only | not synced |

**Stock is never synced directly.** Because all stock changes flow through Purchase
Orders and Invoices (Documents), replaying the Document sync log on the server
produces the correct stock state without any conflict.

---

## Conflict resolution strategy

### Metadata records (People, Product, Account, Place)

Last-write-wins, compared by the ULID of the SyncLog entry that describes the change.
Higher ULID = later timestamp = wins.

### Financial records (Tx, Document)

Append-only — once created, they are never modified or deleted. If both devices
created the same logical document (rare but possible), both records are kept with
their own ULIDs. The business user resolves duplicates manually.

### Deletion conflicts

Soft deletes only. A record is marked `deleted_at` but never hard-deleted locally.
If device A deletes a record and device B updates it: deletion wins (standard
CouchDB convention). If this is unacceptable for a specific table it can be overridden.

---

## Offline/Online workflow

```
User opens laptop (offline)
  → Wails app reads from local SQLite
  → All writes recorded in local SyncLog

User comes online
  → App calls POST /api/sync/push — sends all SyncLog entries not yet pushed
  → Server accepts, resolves conflicts, stores in PostgreSQL
  → App calls GET /api/sync/pull?cursor=<last> — gets remote changes
  → App upserts received records into local SQLite

User opens browser (online) at same time as laptop (offline)
  → Browser writes go directly to server (PostgreSQL)
  → When laptop reconnects, push/pull merges everything
```

The desktop app can operate for any length of time without connectivity. All data
is written to SQLite first. Sync is a background operation, not a prerequisite.

---

## Authentication

### Desktop app (Wails)

Unchanged — local bcrypt password (`LocalAuth` model, no network required).

### Web app (HTTP API)

JWT bearer tokens. The same `LocalAuth` table on the server stores the bcrypt hash.
On successful login, server issues a signed JWT (15-minute access token + 7-day
refresh token stored in an httpOnly cookie).

---

## New dependencies

| Package | Purpose |
|---------|---------|
| `github.com/oklog/ulid/v2` | ULID generation |
| `gorm.io/driver/postgres` | PostgreSQL for the server |
| `github.com/golang-jwt/jwt/v5` | JWT auth for web API |
| `github.com/labstack/echo/v4` | HTTP framework (already indirect dep via Wails) |

---

## What does NOT change

- All existing `internal/service/` code — zero modifications
- All Svelte components and routes — zero modifications
- The Wails app behaviour — works identically offline
- The licensing system — local-only, not synced
- The local SQLite schema for desktop users — additive change only (new `sync_id` column)

---

## Risk assessment

| Risk | Likelihood | Mitigation |
|------|------------|-----------|
| ULID backfill on existing DBs | Low | BeforeCreate hook auto-assigns; old rows get ULID on first update |
| Sync loop (re-sending own events) | Medium | SyncLog records `device_id`; client skips own entries on pull |
| Integer ID collision across devices | n/a | Integer IDs are local-only; sync uses ULID exclusively |
| PostgreSQL schema drift from SQLite | Low | GORM AutoMigrate runs on both; dialect-neutral models |
| Financial data double-entry | Low | Documents are append-only; human review for duplicates |
