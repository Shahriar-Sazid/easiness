# Remote Connectivity — Implementation Plan

See `FEASIBILITY_REMOTE.md` for architecture decisions and rationale.

---

## Phase 3.0 — ULID Sync Foundation ✅ (non-breaking, desktop-only impact)

**Goal:** Every record has a ULID identity. All mutations are logged. No network yet.

**Tasks:**
- [x] Add `github.com/oklog/ulid/v2` to go.mod
- [x] Update `internal/models/base.go` — add `SyncID string` field with BeforeCreate hook
- [x] Create `internal/models/sync.go` — `SyncLog` model (ULID PK), `DeviceRegistration`
- [x] Create `internal/sync/ulid.go` — thread-safe ULID generator
- [x] Create `internal/sync/hooks.go` — register GORM callbacks: AfterCreate/Update/Delete → write SyncLog
- [x] Update `internal/db/database.go` — migrate SyncLog + DeviceRegistration
- [ ] Update tests if broken by Base SyncID change
- [ ] Create `tests/sync/hooks_test.go` — verify SyncLog entries are created on mutations

**Checkpoint 3.0:** `go test ./...` passes. Every new record gets a ULID. Every
create/update/delete appends a row to `sync_log`.

---

## Phase 3.1 — HTTP API Server ✅

**Goal:** The same services exposed as a JSON REST API over HTTP, with PostgreSQL as
the backend.

**Tasks:**
- [x] Add `gorm.io/driver/postgres`, `github.com/golang-jwt/jwt/v5` to go.mod
- [x] Create `internal/db/postgres.go` — `InitializePostgres(dsn string)` using same `migrate()`
- [x] Create `internal/api/middleware/auth.go` — JWT bearer token validation
- [x] Create `internal/api/middleware/errors.go` — map service errors to HTTP status codes
- [x] Create `internal/api/handlers/` — auth, account, people, product, business, sync
- [x] Create `internal/api/router.go` — register all routes on Echo
- [x] Create `cmd/server/main.go` — read config (env vars), init PostgreSQL, start HTTP
- [x] Create `cmd/server/config.go` — config struct (DSN, JWT secret, port, etc.)

**Checkpoint 3.1:** `go run ./cmd/server` starts. All business endpoints respond with
correct JSON. Postman / curl can perform full CRUD.

---

## Phase 3.2 — Sync Protocol ✅

**Goal:** Desktop app can push local changes to the server and pull remote changes.

**Tasks:**
- [x] Create `internal/sync/protocol.go` — `PushRequest`, `PushResponse`, `PullResponse`
- [x] Create `internal/sync/service.go` — `SyncService` with `Push(entries)` and `Pull(cursor, deviceID)`
- [x] Create `internal/api/handlers/sync.go` — register, push, pull HTTP endpoints
- [x] Create `internal/sync/applier.go` — upsert received entries into local DB
- [x] Create `internal/sync/client.go` — desktop push-then-pull cycle
- [x] Wire sync client into Wails `app.go` — SyncNow, GetSyncStatus, ConfigureSync
- [x] Add sync stubs to `frontend/src/wailsjs/go/main/App.js`
- [x] Create `tests/sync/sync_test.go` — 6 integration tests covering the full sync lifecycle

**Checkpoint 3.2:** Populate data in desktop (SQLite), call `SyncNow()`, verify data
appears in server (PostgreSQL). Modify on server, pull on desktop, verify merge.

---

## Phase 3.3 — Web Frontend ✅

**Goal:** Existing Svelte app runs in a browser, talking to the HTTP API — zero component changes.

**Tasks:**
- [x] Update `frontend/src/wailsjs/go/main/App.js` — HTTP fallback in `call()` for all methods
- [x] Create `frontend/src/stores/sync.ts` — sync status, last sync time, pending count, trigger
- [x] Update Topbar — sync indicator button (spin/check/cloud-slash) + pending badge
- [x] Update `frontend/src/App.svelte` — startPolling on login
- [x] Update `App.js` + `App.d.ts` — SyncNow, GetSyncStatus, ConfigureSync stubs
- [x] Update `models.ts` — sync_SyncStatusResponse, sync_ConfigureSyncRequest

**Checkpoint 3.3:** Open `http://localhost:8080` in a browser. Log in. Create a product.
Switch to desktop app, sync, verify product appears. Modify offline on desktop, reconnect,
verify it syncs to browser.

---

## Phase 3.4 — Build & Deploy ✅

**Goal:** Packaged server that can be self-hosted.

**Tasks:**
- [x] Add `Dockerfile` — multi-stage: Node (frontend) → Go (server binary, no CGo) → alpine runtime
- [x] Add `docker-compose.yml` — server + PostgreSQL 16
- [x] Add `.dockerignore` + `.env.example`
- [x] Add `build-server`, `docker-build`, `docker-up`, `docker-down`, `docker-logs` to `Makefile`
- [x] Add `docker` job to `.github/workflows/build.yml` — builds + pushes to GHCR on tag push
- [x] Write `docs/self-hosting.md` — full setup guide (env vars, HTTPS, backup, health check)

**Checkpoint 3.4:** `docker compose up -d` starts server. Browse to `http://localhost:8080`.

---

## File layout (new files only)

```
easiness-wails/
├── cmd/
│   └── server/
│       ├── main.go          # HTTP server entry point
│       └── config.go        # env-var config
├── internal/
│   ├── db/
│   │   └── postgres.go      # PostgreSQL initializer
│   ├── sync/
│   │   ├── ulid.go          # thread-safe ULID generator
│   │   ├── hooks.go         # GORM callbacks → SyncLog
│   │   ├── applier.go       # apply incoming SyncLog entries
│   │   ├── client.go        # desktop sync client
│   │   ├── protocol.go      # push/pull request-response types
│   │   └── service.go       # server-side sync logic
│   ├── models/
│   │   └── sync.go          # SyncLog, DeviceRegistration models
│   └── api/
│       ├── router.go        # Echo route registration
│       ├── middleware/
│       │   ├── auth.go      # JWT validation
│       │   └── errors.go    # error → HTTP status mapping
│       └── handlers/
│           ├── account.go
│           ├── people.go
│           ├── product.go
│           ├── tx.go
│           ├── unit.go
│           ├── place.go
│           ├── stock.go
│           ├── business.go
│           ├── document.go
│           ├── dashboard.go
│           ├── auth.go
│           ├── license.go
│           └── sync.go
└── frontend/src/
    ├── lib/
    │   └── api.ts           # fetch-based HTTP client
    └── stores/
        └── sync.ts          # sync status store
```

---

## Environment variables (server)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | required | PostgreSQL DSN |
| `JWT_SECRET` | required | ≥ 32 random bytes, base64 |
| `PORT` | `8080` | HTTP listen port |
| `FRONTEND_DIR` | `./frontend/dist` | Path to built Svelte assets |
| `DEVICE_TIMEOUT_DAYS` | `90` | Days before inactive device removed |

---

## Resumption instructions

Open `PROGRESS.md` for the last completed checkpoint, then refer to the relevant phase
above for the next unchecked task.
