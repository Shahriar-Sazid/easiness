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

## Phase 0 — Project Skeleton ✅ (current phase)

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

## Phase 1 — Database Layer

**Goal:** SQLite database initializes with correct schema matching the existing `ddl.sql`.

**Tasks:**
- [ ] Write `internal/models/` (all 11 entity structs)
- [ ] Write `internal/db/database.go` (GORM init + AutoMigrate)
- [ ] Write `internal/db/seed.go` (seed units + unit conversions from existing data)
- [ ] Write `tests/service/db_test.go` (test schema creation)

**Checkpoint 1:** `go test ./tests/service/... -run TestDatabaseInit` passes.
Schema matches column names of existing SQLite database.

---

## Phase 2 — DTO Layer

**Goal:** All request/response types defined as Go structs.

**Tasks:**
- [ ] Write `internal/dto/common.go` (Page[T], SearchRequest, errors)
- [ ] Write `internal/dto/account.go`
- [ ] Write `internal/dto/people.go`
- [ ] Write `internal/dto/product.go`
- [ ] Write `internal/dto/stock.go`
- [ ] Write `internal/dto/document.go`
- [ ] Write `internal/dto/tx.go`
- [ ] Write `internal/dto/unit.go`
- [ ] Write `internal/dto/place.go`
- [ ] Write `internal/dto/dashboard.go`
- [ ] Write `internal/dto/auth.go`

**Checkpoint 2:** `go build ./...` compiles with zero errors.

---

## Phase 3 — Core Services (IPC parity)

**Goal:** All 17 original IPC channels implemented as tested Go services.

**Tasks (write test first, then implement — TDD):**
- [ ] AccountService: Create, Update, Search, GetAll (+ test)
- [ ] PeopleService: Create, Update, Search, GetCustomers, GetSuppliers, GetAll, GetDetails (+ test)
- [ ] ProductService: Create, Update, Search, Move (+ test)
- [ ] TxService: Search (+ test)
- [ ] UnitService: GetAll (+ test)

**Checkpoint 3:** `go test ./tests/service/... -run TestAccount|TestPeople|TestProduct|TestTx|TestUnit` — all pass.

---

## Phase 4 — Extended Services (REST parity)

**Goal:** Business operations, stock, documents, dashboard implemented and tested.

**Tasks (TDD):**
- [ ] PlaceService: Create, Update, GetAll (+ test)
- [ ] StockService: AddInitialStock, Find (+ test)
- [ ] DocumentService: SavePurchaseOrder, SaveInvoice, Search, GetDetails (+ test)
- [ ] BusinessService: orchestrates document + stock + payment (+ test)
- [ ] DashboardService: GetDashboard metrics (+ test)
- [ ] AuthService: Setup, Login, ChangePassword (+ test)

**Checkpoint 4:** `go test ./...` — all tests pass. Backend is feature-complete.

---

## Phase 5 — Wails Bindings

**Goal:** All service methods wired to the Wails App struct; TypeScript types auto-generated.

**Tasks:**
- [ ] Wire all services into `app.go`
- [ ] Run `wails generate module` to generate `frontend/src/wailsjs/`
- [ ] Verify generated TypeScript types match DTO structs

**Checkpoint 5:** `wails build` compiles without errors. `wailsjs/go/main/App.d.ts` exists
and contains all method signatures.

---

## Phase 6 — Svelte Frontend Core

**Goal:** Navigation, stores, shared components, and routing working.

**Tasks:**
- [ ] Write `src/stores/` (auth, units, people, products, accounts, ui)
- [ ] Write `src/types/` (TypeScript interfaces matching Go DTOs)
- [ ] Write `src/lib/` (format utilities replacing Angular pipes)
- [ ] Write `src/components/shared/` (Datatable, Modal, Pagination, Toast, Spinner, Navbar, Sidebar)
- [ ] Write `src/App.svelte` (router setup with auth guard)
- [ ] Write login page

**Checkpoint 6:** `wails dev` shows sidebar navigation; login redirects to dashboard.

---

## Phase 7 — Svelte Pages

**Goal:** All original Angular pages ported to Svelte.

**Tasks:**
- [ ] Dashboard page
- [ ] Products list + create/edit form
- [ ] People list + create/edit form  
- [ ] Accounting page (account list + transaction list + create TX)
- [ ] Business Buy page (purchase order form)
- [ ] Business Sell page (invoice form)
- [ ] Place management page

**Checkpoint 7:** All pages render and perform CRUD operations end-to-end.

---

## Phase 8 — Frontend Tests

**Goal:** Unit tests for stores, lib utilities, and key components.

**Tasks:**
- [ ] Setup Vitest + @testing-library/svelte
- [ ] Test lib/format utilities
- [ ] Test auth store
- [ ] Test key components (Datatable, Pagination)
- [ ] Setup Playwright for e2e (optional)

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

## Phase 10 — Build & Package

**Goal:** Single executable produced by `wails build`.

**Tasks:**
- [ ] Configure `wails.json` with correct app metadata
- [ ] Add app icon to `build/windows/`
- [ ] Run `wails build -platform windows/amd64`
- [ ] Smoke-test the packaged `.exe`
- [ ] Document build process in README.md

**Checkpoint 10:** Packaged `.exe` launches, connects to SQLite database, performs all operations.

---

## Resumption Instructions

If this session is interrupted, open `PROGRESS.md` to see the last completed checkpoint
and the current in-progress task. Then:

1. Read `PROGRESS.md` to find the last checkpoint
2. Read the relevant Phase section above
3. Check `go test ./...` and `npm test` to verify the current baseline
4. Continue from the first unchecked task in the current phase

All phase work is in `easiness-wails/`. The original `easiness-ui/` is untouched.
