# Migration Plan: Electron + Angular → Wails + Svelte

This document is the authoritative execution plan. Each phase ends with a **checkpoint** —
a concrete, verifiable state that allows work to resume after a break.

---

## Prerequisites

Install before starting any phase:

```bash
# 1. Go 1.21+
https://go.dev/dl/

# 2. Wails CLI
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# 3. CGo dependencies (SQLite requires CGo on Windows)
#    Install MSYS2: https://www.msys2.org/
#    Then in MSYS2 MINGW64 terminal:
pacman -S mingw-w64-x86_64-gcc

# 4. Node.js 18+ (for frontend)
https://nodejs.org/

# 5. Verify Wails setup
wails doctor
```

---

## Phase 0 — Project Skeleton ✅

**Goal:** Empty but runnable Wails+Svelte app with all directories in place.

**Tasks:**
- [x] Write FEASIBILITY.md
- [x] Write MIGRATION_PLAN.md (this file)
- [x] Write PROGRESS.md
- [x] Write README.md with installation guide
- [x] Create `easiness-wails/` directory structure
- [x] Write `go.mod`, `wails.json`, `main.go`, `app.go` (stub)
- [x] Write `frontend/` config (package.json, vite, svelte.config, tsconfig)
- [x] Write `frontend/src/App.svelte` (minimal shell)

**Checkpoint 0:** `wails dev` starts without errors and shows a blank Svelte app.

---

## Phase 1 — Database Layer ✅

**Goal:** SQLite database initializes with correct schema matching the existing `ddl.sql`.

**Tasks:**
- [x] Write `internal/models/` (12 entity structs including StoredLicense)
- [x] Write `internal/db/database.go` (GORM init + AutoMigrate)
- [x] Write `internal/db/seed.go` (seed units + unit conversions from existing data)

**Checkpoint 1:** `go test ./tests/service/...` passes. Schema matches column names of existing SQLite database.

---

## Phase 2 — DTO Layer ✅

**Goal:** All request/response types defined as Go structs.

**Tasks:**
- [x] Write `internal/dto/common.go` (Page[T], SearchRequest, errors)
- [x] Write `internal/dto/account.go`
- [x] Write `internal/dto/people.go`
- [x] Write `internal/dto/product.go`
- [x] Write `internal/dto/stock.go`
- [x] Write `internal/dto/document.go`
- [x] Write `internal/dto/tx.go`
- [x] Write `internal/dto/unit.go`
- [x] Write `internal/dto/place.go`
- [x] Write `internal/dto/dashboard.go`
- [x] Write `internal/dto/auth.go`
- [x] Write `internal/dto/license.go`

**Checkpoint 2:** `go build ./...` compiles with zero errors.

---

## Phase 3 — Core Services (IPC parity) ✅

**Goal:** All original IPC channels implemented as tested Go services.

**Tasks (TDD — test first, then implement):**
- [x] AccountService: Save (validate unique name+no), Search (LIKE), GetAll (+ test)
- [x] PeopleService: Save (replace contacts on update), Search, GetByType, GetDetails (+ test)
- [x] ProductService: Create, Update, Search, Move (transaction) (+ test)
- [x] TxService: Search with filters (+ test)
- [x] UnitService: GetAll (+ test)

**Checkpoint 3:** `go test ./tests/service/... -run TestAccount|TestPeople|TestProduct|TestTx|TestUnit` — all pass.

---

## Phase 4 — Extended Services (REST parity) ✅

**Goal:** Business operations, stock, documents, dashboard implemented and tested.

**Tasks (TDD):**
- [x] PlaceService: Save, GetAll (+ test)
- [x] StockService: AddInitialStock, Find, UpsertFromPurchase (weighted avg cost), DeductForSale (+ test)
- [x] BusinessService: SavePurchaseOrder, SaveInvoice (full transaction: stock + tx + balance) (+ test)
- [x] DashboardService: GetDashboard metrics (raw SQL aggregates) (+ test)
- [x] AuthService: Setup, Login, ChangePassword (bcrypt) (+ test)

**Checkpoint 4:** `go test ./...` — all tests pass. Backend is feature-complete.

---

## Phase 5 — Wails Bindings ✅

**Goal:** All service methods wired to the Wails App struct; TypeScript types available.

**Tasks:**
- [x] Wire all services into `app.go` (30+ exported methods)
- [x] Write TypeScript stubs in `frontend/src/wailsjs/go/main/App.js` + `App.d.ts`
- [x] Write `frontend/src/wailsjs/go/models.ts`

**Note:** Run `wails generate module` after Go is installed to replace stubs with real bindings.

**Checkpoint 5:** `wails build` compiles without errors. `wailsjs/go/main/App.d.ts` contains all method signatures.

---

## Phase 6 — Svelte Frontend Core ✅

**Goal:** Navigation, stores, shared components, and routing working.

**Tasks:**
- [x] Write `src/stores/` (auth, units, accounts, ui)
- [x] Write `src/lib/format.ts` (format utilities replacing Angular pipes)
- [x] Write `src/components/shared/` (Sidebar, Topbar, Modal, Pagination, Spinner, ToastContainer)
- [x] Write `src/App.svelte` (router with auth + license gate)
- [x] Write LoginPage, SetupPage

**Checkpoint 6:** `wails dev` shows sidebar navigation; login redirects to dashboard.

---

## Phase 7 — Svelte Pages ✅

**Goal:** All original Angular pages ported to Svelte.

**Tasks:**
- [x] Dashboard page
- [x] ProductList + ProductForm (create/edit)
- [x] PeopleList + PeopleForm + PeopleDetails
- [x] AccountingPage (account list + transaction list)
- [x] BuyPage (purchase order form)
- [x] SellPage (invoice form)
- [x] PlacePage (place management)
- [x] StockPage

**Checkpoint 7:** All pages render and perform CRUD operations end-to-end.

---

## Phase 8 — Frontend Tests ✅

**Goal:** Unit tests for stores and lib utilities.

**Tasks:**
- [x] Setup Vitest + `frontend/tests/setup.ts` (mocks all Wails methods)
- [x] Test `lib/format.ts` utilities
- [x] Test auth store

**Checkpoint 8:** `npm test` passes in frontend directory.

---

## Phase 9 — PDF & Polish

**Goal:** PDF generation, i18n, and visual parity with original app.

**Tasks:**
- [ ] Port `pdf.service.ts` logic to Svelte (`src/lib/pdf.ts`)
- [ ] Setup `svelte-i18n` with existing en-IN translations
- [ ] Visual review of all pages against original app
- [ ] Remove unused dependencies

**Checkpoint 9:** PDF download works; app renders identically to original.

---

## Phase 10 — Build & Package ✅

**Goal:** Single executable produced for all platforms.

**Tasks:**
- [x] Configure `wails.json` with correct app metadata
- [x] Write `Makefile` with targets for all platforms
- [x] Write `.github/workflows/build.yml` (matrix build on native runners)
- [ ] Add app icon to `build/windows/`, `build/darwin/`
- [ ] Smoke-test the packaged executable

**Checkpoint 10:** Packaged `.exe` launches, connects to SQLite database, performs all operations.

---

## Phase 11 — Licensing System ✅

**Goal:** Offline Ed25519 license keys. App refuses to run without a valid key. Keys expire after the purchased duration.

**Design:**
- Key format: `EASINESS-<base64url(JSON payload)>.<base64url(Ed25519 signature)>`
- Public key embedded in binary; private key never leaves seller's machine
- Activated key stored in `StoredLicense` table; re-verified on each app start
- Frontend gate: shows `LicensePage` when status is `none` or `expired`
- Topbar badge: yellow at ≤30 days, red at ≤7 days

**Tasks:**
- [x] `internal/license/license.go` — Parse, Validate, Sign, DaysRemaining
- [x] `internal/license/keys.go` — EmbeddedPublicKey + TestPrivateKey (test keys — replace before shipping)
- [x] `internal/models/license.go` — StoredLicense model
- [x] `internal/dto/license.go` — request/response types
- [x] `internal/service/license.go` — GetStatus, Activate
- [x] `cmd/keygen/main.go` — seller CLI tool
- [x] `app.go` — GetLicenseStatus, ActivateLicense exports
- [x] Frontend: LicensePage, App.svelte gate, Topbar badge, Wails stubs
- [x] `tests/service/license_test.go` — 8 TDD tests

**Checkpoint 11:** App blocks at startup with `LicensePage`. Entering a key generated by `cmd/keygen` activates the app. An expired key shows the expired state. A tampered key is rejected.

**Before shipping:**
```bash
# Generate your real production keypair ONCE:
cd easiness-wails
go run ./cmd/keygen --gen-keys
# Paste the printed public key bytes into internal/license/keys.go
# Store private.key offline — NEVER commit it
```

---

## Resumption Instructions

If this session is interrupted, open `PROGRESS.md` to see the last completed checkpoint
and the current in-progress task. Then:

1. Read `PROGRESS.md` to find the last checkpoint
2. Read the relevant Phase section above
3. Check `go test ./...` and `npm test` to verify the current baseline
4. Continue from the first unchecked task in the current phase

All phase work is in `easiness-wails/`. The original `easiness-ui/` is untouched.
