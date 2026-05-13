# Feasibility Analysis: Electron + Angular → Wails + Svelte

**Date:** 2026-05-13  
**Current stack:** Electron 19 · Angular 14 · Express 4 · TypeORM 0.3 · SQLite (better-sqlite3) · Big.js  
**Target stack:** Wails v2 · Svelte 5 · GORM · SQLite (go-sqlite3) · shopspring/decimal

---

## 1. Executive Summary

Migration is **fully feasible**. The existing codebase has clean separation between backend
(Express/TypeORM services) and frontend (Angular components), which maps well to the
Wails model of bound Go methods called from a Svelte frontend. No features need to be
dropped; two features need re-architecture.

---

## 2. Feature Inventory

| Domain | Current | Target | Difficulty |
|--------|---------|--------|------------|
| Account CRUD | TypeORM + IPC | GORM + Wails binding | Low |
| People CRUD | TypeORM + IPC | GORM + Wails binding | Low |
| Product CRUD + Move | TypeORM + IPC | GORM + Wails binding | Low |
| Stock management | TypeORM + Express | GORM + Wails binding | Medium |
| Purchase Orders | TypeORM + Express | GORM + Wails binding | Medium |
| Sales Invoices | TypeORM + Express | GORM + Wails binding | Medium |
| Transactions | TypeORM + IPC | GORM + Wails binding | Low |
| Dashboard metrics | Express + queries | GORM queries + binding | Medium |
| Unit conversions | TypeORM + IPC | GORM + Wails binding | Low |
| Place management | TypeORM + Express | GORM + Wails binding | Low |
| PDF generation | pdfmake (JS) | pdfmake stays in frontend | None |
| Charts | chart.js | chart.js stays in frontend | None |
| i18n | ngx-translate | svelte-i18n | Low |
| Authentication | Firebase / fake JWT | Local SQLite auth | Medium |
| Precision arithmetic | Big.js | shopspring/decimal | Low |

---

## 3. What Converts Cleanly

### 3.1 Backend → Go

| TypeScript pattern | Go equivalent |
|-------------------|---------------|
| TypeORM entity class | GORM struct with tags |
| `@BigColumn()` transformer | `decimal.Decimal` with custom scanner |
| Repository `find`/`save` | `db.Where(...).Find(&result)` / `db.Save(&entity)` |
| Query builder | GORM's fluent query builder |
| `getPage()` pagination | Generic `Page[T]` with `Limit`/`Offset` |
| IPC handler (17 channels) | Go method bound to Wails App struct |
| Express REST routes | Additional Wails-bound methods |
| Error codes / ApiError | Custom Go error types |
| TypeORM transactions | `db.Transaction(func(tx *gorm.DB) error {...})` |

### 3.2 Frontend → Svelte

| Angular pattern | Svelte equivalent |
|----------------|-------------------|
| Component | `.svelte` single-file component |
| Service (injectable) | Svelte store + module function |
| `Observable` / RxJS | `async`/`await` + Svelte stores |
| `AsyncPipe` | `{#await}` block |
| `*ngFor` | `{#each}` block |
| `*ngIf` | `{#if}` block |
| Lazy-loaded module | Vite code splitting |
| Route guard | Svelte store check in layout |
| Custom pipe | Utility function in `$lib` |
| `@Input()` / `@Output()` | Props / event dispatcher |
| `ngx-datatable` | `svelte-data-table` or custom |
| `ng-select` | `svelte-select` |
| `ngx-dropzone` | `svelte-file-dropzone` |
| `ng-bootstrap` | Bootstrap 5 HTML (no wrapper needed) |
| `ngx-toastr` | `svelte-toasts` |

### 3.3 IPC → Wails Bindings

The 17 IPC channels map 1-to-1 to Go methods:

```
account:create   → App.CreateAccount(req)
account:update   → App.UpdateAccount(id, req)
account:search   → App.SearchAccount(req)
account:getAll   → App.GetAllAccounts()
tx:search        → App.SearchTransactions(req)
product:create   → App.CreateProduct(req)
product:update   → App.UpdateProduct(id, req)
product:search   → App.SearchProduct(req)
product:move     → App.MoveProduct(req)
people:create    → App.CreatePeople(req)
people:update    → App.UpdatePeople(id, req)
people:search    → App.SearchPeople(req)
people:getCustomer → App.GetAllCustomers()
people:getSupplier → App.GetAllSuppliers()
people:getAll    → App.GetAllPeople()
people:getDetails → App.GetPeopleDetails(id)
unit:getAll      → App.GetUnitData()
```

The Express REST routes also become bound methods:
```
GET  /api/v1/business   → App.GetBusinessSummary()
POST /api/v1/business/buy  → App.SavePurchaseOrder(req)
POST /api/v1/business/sell → App.SaveInvoice(req)
GET  /api/v1/dashboard  → App.GetDashboard(req)
...
```

---

## 4. Features Requiring Re-architecture

### 4.1 Authentication

**Current:** Firebase Google One-Tap OR fake JWT stored in `localStorage`.

**Problem:** Firebase requires a browser with internet access and a registered OAuth app.
For a standalone desktop app, cloud OAuth is unnecessary overhead.

**Decision:** Replace with **local PIN/password authentication** stored in SQLite.
- Single-user desktop app → one local account
- Bcrypt hash stored in DB
- Session held in memory (no JWT needed within the same process)
- Optional: allow first-run setup to create credentials

**Impact:** Auth module completely rewritten. Firebase SDK removed. Low user-visible impact.

### 4.2 Big.js Precision Arithmetic

**Current:** `big.js` in Node.js backend via custom `@BigColumn()` TypeORM decorator.
Values stored as `TEXT` in SQLite.

**Go equivalent:** `github.com/shopspring/decimal` — implements `database/sql` Scanner and
Valuer interfaces, stores as TEXT identical to the existing schema.

**Impact:** Zero data migration needed. Drop-in replacement with identical storage format.

---

## 5. What Is NOT Portable

| Item | Reason | Action |
|------|--------|--------|
| Firebase Google One-Tap | Cloud OAuth, not for desktop | Replace with local auth |
| `electron-debug` | Electron-specific | Wails dev mode built-in |
| `electron-reloader` | Electron-specific | Wails dev mode built-in |
| `electron-builder` | Electron packaging | `wails build` replaces it |
| Custom Angular webpack builder | Angular-specific | Vite handles this |
| Karma + Jasmine | Angular test runner | Vitest + Testing Library |
| `@angular-eslint` | Angular linting | ESLint + svelte-check |
| Spectron e2e | Electron-specific | Playwright works with Wails |
| `better-sqlite3` (Node C++ binding) | Node.js native | `gorm.io/driver/sqlite` (CGo) |
| `contextBridge` / `ipcRenderer` | Electron preload | Wails JS runtime (auto-generated) |

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Go CGo (SQLite) build complexity | Medium | Medium | Document CGo deps; use MSYS2/GCC on Windows |
| Complex stock/document service logic | High | Medium | Port service logic method by method with tests |
| Big.js ↔ decimal parity | Low | High | Unit test every decimal operation |
| Frontend styling regression | Medium | Low | Keep Bootstrap 5; Svelte renders same HTML |
| PDF layout differences | Low | Low | pdfmake stays unchanged in frontend |
| i18n translation keys | Low | Low | svelte-i18n uses same JSON translation files |

---

## 7. Conclusion

**Recommendation: Proceed.** All features can be migrated. The architecture actually
simplifies — Wails eliminates the Electron IPC ceremony and the embedded Express server,
replacing both with direct Go method calls. The Svelte frontend is smaller and faster than
Angular 14. The SQLite schema requires no changes.

Estimated migration effort: **~3–4 weeks** for a single developer working full-time.
