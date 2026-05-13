# Migration Progress Tracker

**Last updated:** 2026-05-13  
**Current phase:** All phases complete — ready for first build  
**Last completed checkpoint:** Licensing system (Phase 11)

---

## Completed Checkpoints

| Checkpoint | Description | Date |
|-----------|-------------|------|
| 0 | Project skeleton created | 2026-05-13 |
| 1 | Database layer + all models | 2026-05-13 |
| 2 | All DTOs | 2026-05-13 |
| 3 | Core services (Account, People, Product, Tx, Unit) + TDD tests | 2026-05-13 |
| 4 | Extended services (Place, Stock, Business, Dashboard, Auth) + TDD tests | 2026-05-13 |
| 5 | Wails bindings + TypeScript stubs | 2026-05-13 |
| 6 | Svelte frontend core (stores, shared components, routing, auth gate) | 2026-05-13 |
| 7 | All Svelte pages (Dashboard, Products, People, Accounting, Buy, Sell, Place, Stock) | 2026-05-13 |
| 8 | Frontend tests (Vitest — format utils, auth store) | 2026-05-13 |
| 10 | Multi-platform builds: Makefile + GitHub Actions CI/CD | 2026-05-13 |
| 11 | Licensing system (Ed25519, keygen CLI, service, frontend gate) | 2026-05-13 |

---

## Current Status — Feature Complete

### Phase 0 — Project Skeleton ✅
- [x] Directory structure, go.mod, wails.json, main.go, app.go
- [x] FEASIBILITY.md, MIGRATION_PLAN.md, PROGRESS.md, README.md

### Phase 1 — Database Layer ✅
- [x] `internal/models/` — 12 entity structs (Account, People, ContactNo, Product, Place, Stock, Document, DocumentItem, Tx, Unit, UnitConversion, LocalAuth, StoredLicense)
- [x] `internal/db/database.go` — GORM + SQLite init, AutoMigrate, PRAGMA foreign_keys
- [x] `internal/db/seed.go` — seeds 10 units + 8 unit conversions

### Phase 2 — DTO Layer ✅
- [x] `internal/dto/` — 11 files (common, account, people, product, stock, document, tx, unit, place, dashboard, auth, license)

### Phase 3 — Core Services ✅ (TDD)
- [x] AccountService: Save, Search, GetAll
- [x] PeopleService: Save, Search, GetByType, GetDetails
- [x] ProductService: Create, Update, Search, Move
- [x] TxService: Search
- [x] UnitService: GetAll
- [x] `tests/service/account_test.go`, `people_test.go`, `product_test.go`

### Phase 4 — Extended Services ✅ (TDD)
- [x] PlaceService: Save, GetAll
- [x] StockService: Find, AddInitialStock, UpsertFromPurchase, DeductForSale
- [x] BusinessService: SavePurchaseOrder, SaveInvoice (full transaction)
- [x] DashboardService: GetDashboard (raw SQL aggregates)
- [x] AuthService: IsSetupRequired, Setup, Login, ChangePassword (bcrypt)
- [x] `tests/service/business_test.go`, `auth_test.go`

### Phase 5 — Wails Bindings ✅
- [x] All services wired into `app.go` (30+ exported methods)
- [x] TypeScript stubs in `frontend/src/wailsjs/go/main/App.js` + `App.d.ts`
- [x] `frontend/src/wailsjs/go/models.ts`

### Phase 6 — Svelte Frontend Core ✅
- [x] `src/stores/` — auth, units, accounts, ui
- [x] `src/lib/format.ts` — all format utilities
- [x] `src/components/shared/` — Sidebar, Topbar, Modal, Pagination, Spinner, ToastContainer
- [x] `src/App.svelte` — router with auth + license gate

### Phase 7 — Svelte Pages ✅
- [x] Dashboard, ProductList, ProductForm
- [x] PeopleList, PeopleForm, PeopleDetails
- [x] AccountingPage, BuyPage, SellPage
- [x] PlacePage, StockPage
- [x] LoginPage, SetupPage

### Phase 8 — Frontend Tests ✅
- [x] `frontend/tests/setup.ts` — mocks all Wails methods
- [x] `frontend/tests/lib.format.test.ts`
- [x] `frontend/tests/stores.auth.test.ts`

### Phase 10 — Build & Package ✅
- [x] `Makefile` with targets for all platforms
- [x] `.github/workflows/build.yml` — matrix build on native runners (Windows, macOS Intel, macOS ARM, Linux)
- [x] `wails.json` with app metadata

### Phase 11 — Licensing System ✅
- [x] `internal/license/license.go` — Ed25519 offline key parse/verify/sign
- [x] `internal/license/keys.go` — embedded test public key + TestPrivateKey for tests
- [x] `internal/models/license.go` — StoredLicense GORM model
- [x] `internal/dto/license.go` — ActivateLicenseRequest, LicenseStatusResponse
- [x] `internal/service/license.go` — GetStatus, Activate, maskKey
- [x] `cmd/keygen/main.go` — seller CLI tool (gen-keys, generate, verify)
- [x] `app.go` — GetLicenseStatus, ActivateLicense wired
- [x] `frontend/src/routes/license/LicensePage.svelte` — activation form + expired banner
- [x] `frontend/src/App.svelte` — license gate (blocks app if none/expired)
- [x] `frontend/src/components/shared/Topbar.svelte` — expiry warning badge (≤30 days)
- [x] `frontend/src/wailsjs/go/models.ts` — dto_LicenseStatusResponse, dto_ActivateLicenseRequest
- [x] `frontend/src/wailsjs/go/main/App.d.ts` + `App.js` — GetLicenseStatus, ActivateLicense stubs
- [x] `tests/service/license_test.go` — 8 TDD tests

---

## In-Progress Task

None — all implementation complete.

---

## Next Steps (to get a running build)

1. **Install prerequisites** (see README.md → Prerequisites)
   ```powershell
   # Install Go 1.21+ from https://go.dev/dl/
   # Install Node.js 18+ from https://nodejs.org/
   # Install Wails CLI:
   go install github.com/wailsapp/wails/v2/cmd/wails@latest
   # Install MSYS2 GCC for CGo (Windows only):
   # https://www.msys2.org/ → pacman -S mingw-w64-x86_64-gcc
   ```

2. **Generate your production license keypair** (ONCE, before shipping):
   ```powershell
   cd easiness-wails
   go run ./cmd/keygen --gen-keys
   # Paste the printed public key into internal/license/keys.go
   # Store private.key securely — NEVER commit it
   ```

3. **Verify backend builds and tests pass:**
   ```powershell
   cd easiness-wails
   go build ./...
   go test ./...
   ```

4. **Verify frontend:**
   ```powershell
   cd easiness-wails/frontend
   npm install
   npm run check
   npm test
   ```

5. **Start dev server:**
   ```powershell
   cd easiness-wails
   wails dev
   ```

6. **Ship** — push a version tag to trigger the GitHub Actions multi-platform build:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

---

## Known Issues / Blockers

| Issue | Status | Notes |
|-------|--------|-------|
| Go not yet installed on dev machine | Blocking build/test | Install from https://go.dev/dl/ |
| Wails CLI not installed | Blocking dev/build | `go install github.com/wailsapp/wails/v2/cmd/wails@latest` |
| CGo/GCC required for SQLite | Blocking build on Windows | Install MSYS2 + mingw-w64-x86_64-gcc |
| Test public key is a TEST key | Must fix before shipping | Run `go run ./cmd/keygen --gen-keys` and update keys.go |
| Phase 9 (PDF / i18n) not yet done | Non-blocking for MVP | PDF export and translations not ported yet |

---

## Session Resumption Checklist

```powershell
# 1. Check Go installation
go version

# 2. Check Wails installation
wails version

# 3. Check backend compiles and tests pass
cd easiness-wails
go build ./...
go test ./...

# 4. Check frontend
cd frontend
npm install
npm run check
npm test

# 5. Start dev server
cd ..
wails dev
```
