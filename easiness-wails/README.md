# Easiness — Wails + Svelte

A cross-platform desktop business management application.  
Backend: Go + Wails v2 + GORM + SQLite  
Frontend: Svelte 5 + TypeScript + Vite + Bootstrap 5

---

## Features

- **Account management** — bank accounts with running balances
- **People management** — customers and suppliers with contact details
- **Product catalogue** — products with variants (type, brand, size, country)
- **Inventory (Stock)** — multi-warehouse stock with unit conversion
- **Purchase Orders** — buy from suppliers, auto-update stock and balances
- **Sales Invoices** — sell to customers, auto-update stock and balances
- **Transactions** — income, expense, and bank-transfer ledger
- **Dashboard** — top products, recent transactions, balance summary
- **PDF export** — purchase orders and invoices as printable PDFs
- **Unit conversions** — convert between measurement units (kg/g, pcs/dozen, etc.)
- **License management** — offline Ed25519-signed keys; app blocks at startup if no valid key

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Go | 1.21+ | https://go.dev/dl/ |
| Node.js | 18+ | https://nodejs.org/ |
| Wails CLI | v2.8+ | `go install github.com/wailsapp/wails/v2/cmd/wails@latest` |
| GCC (Windows) | via MSYS2 | See Windows section below |

### Windows — CGo / GCC Setup

SQLite requires CGo, which requires GCC on Windows.

1. Download and install **MSYS2** from https://www.msys2.org/
2. Open **MSYS2 MINGW64** terminal and run:
   ```bash
   pacman -S mingw-w64-x86_64-gcc
   ```
3. Add `C:\msys64\mingw64\bin` to your system `PATH`.
4. Verify: open a new PowerShell and run `gcc --version`.

### macOS

Xcode Command Line Tools provides GCC automatically:
```bash
xcode-select --install
```

### Linux

```bash
sudo apt install build-essential
```

---

## Development Setup

```bash
# 1. Clone / navigate to the wails project
cd easiness-wails

# 2. Verify Wails environment
wails doctor

# 3. Install frontend dependencies
cd frontend && npm install && cd ..

# 4. Start development server (hot-reload for both Go and Svelte)
wails dev
```

The app opens in a native window. The Vite dev server runs on `http://localhost:34115`
and is accessible in a browser for UI-only development.

---

## Running Tests

### Backend (Go)

```bash
cd easiness-wails
go test ./... -v
```

Tests use an in-memory SQLite database — no external dependencies.

### Frontend (Svelte + Vitest)

```bash
cd easiness-wails/frontend
npm test
```

### End-to-End (Playwright — optional)

```bash
cd easiness-wails/frontend
npm run test:e2e
```

---

## Building

### ⚠️ Cross-compilation is NOT supported

Because SQLite uses **CGo** (a C extension), Go cannot cross-compile this app.
You must build each platform **on its own native machine** (or use the GitHub Actions workflow).

| Want to build for | Must run on |
|-------------------|-------------|
| Windows `.exe` | Windows machine |
| macOS `.app` / `.dmg` | macOS machine |
| Linux binary / AppImage | Linux machine |

---

### Quick build (current platform)

```bash
# Dev build (with devtools)
wails build

# Production build (optimised, no devtools)
wails build -production
```

---

### Windows

```powershell
# Portable .exe
wails build -production -platform windows/amd64

# NSIS installer (.exe installer wizard)
wails build -production -platform windows/amd64 -nsis

# ARM64 (Surface Pro X, Snapdragon laptops)
wails build -production -platform windows/arm64
```

**Output:** `build/bin/easiness.exe`  
**Installer output:** `build/bin/easiness-amd64-installer.exe`

**Icon:** Place `build/windows/icon.ico` before building (see `build/windows/README.md`).

---

### macOS

```bash
# Intel Mac
wails build -production -platform darwin/amd64

# Apple Silicon (M1/M2/M3)
wails build -production -platform darwin/arm64

# Universal binary (runs on both)
wails build -production -platform darwin/universal
```

**Output:** `build/bin/easiness.app`

Package as DMG:
```bash
make package-mac
```

**Icon:** Place `build/darwin/icon.icns` before building (see `build/darwin/README.md`).

**Notarization:** Required for distribution outside the Mac App Store.
See `build/darwin/README.md` for signing + `notarytool` commands.

---

### Linux

```bash
# x86_64
wails build -production -platform linux/amd64

# ARM64 (Raspberry Pi 4+, AWS Graviton)
wails build -production -platform linux/arm64
```

**Output:** `build/bin/easiness`

Package as AppImage (portable, works on all distros):
```bash
make package-linux-appimage
```

**System deps on build machine:**
```bash
sudo apt-get install -y gcc libgtk-3-dev libwebkit2gtk-4.0-dev pkg-config
```

See `build/linux/README.md` for `.deb` and `.rpm` packaging.

---

### Automated multi-platform builds (GitHub Actions)

Push a version tag to trigger builds for all platforms in parallel on native runners:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow (`.github/workflows/build.yml`) will:
1. Build Windows `.exe` + NSIS installer on `windows-latest`
2. Build macOS `.app` / `.dmg` on `macos-13` (Intel) and `macos-14` (Apple Silicon)
3. Build Linux binary on `ubuntu-22.04`
4. Create a GitHub Release with all four artefacts attached

You can also trigger a build manually from **Actions → Build & Release → Run workflow**.

---

### Makefile targets

```bash
make help            # list all targets
make dev             # start hot-reload dev server
make build           # dev build, current platform
make build-prod      # production build, current platform
make build-windows   # Windows (run on Windows)
make build-mac-intel # macOS Intel (run on macOS Intel)
make build-mac-arm   # macOS Apple Silicon (run on macOS M*)
make build-linux     # Linux (run on Linux)
make package-mac     # wrap .app into DMG (macOS)
make test            # Go backend tests
make test-frontend   # Vitest frontend tests
make test-all        # all tests
make generate        # regenerate Wails JS bindings
make clean           # remove build artefacts
```

---

## Database

The SQLite database file is stored at:
- **Windows:** `%APPDATA%\easiness\easiness.db`
- **macOS:** `~/Library/Application Support/easiness/easiness.db`
- **Linux:** `~/.local/share/easiness/easiness.db`

The path is resolved by Wails using `github.com/wailsapp/wails/v2/pkg/runtime`.

### Migrating Existing Data

If you have data in the old Electron app's `easiness-db` SQLite file, the schema is
**identical** — you can copy the file to the new path and it will work without any
migration script.

---

## Architecture Decisions

### Why Wails over Electron?
- Single binary deployment (no Node.js runtime bundled)
- ~50% smaller executable size
- Native Go performance for business logic
- Direct method calls instead of IPC message passing

### Why Svelte over Angular?
- No build-time framework overhead
- Smaller bundle (no zone.js, no DI container)
- Simpler reactivity model (stores vs RxJS)
- Faster cold start

### Why GORM over TypeORM?
- Go is statically compiled — type safety at build time
- GORM AutoMigrate handles schema changes
- No JavaScript runtime needed for DB operations

### Decimal precision
Big.js (Node) and shopspring/decimal (Go) both store values as TEXT in SQLite with
the same format (`123.456789`). Existing databases require no conversion.

---

## Licensing

Easiness uses **offline Ed25519 license keys**. No internet is required for verification —
the public key is embedded in the binary. The private key never leaves the seller's machine.

### Key format

```
EASINESS-<base64url(JSON payload)>.<base64url(Ed25519 signature)>
```

### Setup (seller — do this ONCE before shipping)

```bash
cd easiness-wails

# 1. Generate your production keypair
go run ./cmd/keygen --gen-keys
#    → writes private.key and public.key
#    → prints Go byte literal to paste into internal/license/keys.go

# 2. Paste the printed public key into internal/license/keys.go
#    Replace EmbeddedPublicKey (and remove TestPrivateKey from that file)

# 3. Store private.key securely — password manager or offline device
#    NEVER commit private.key to version control
```

### Generating a license key for a customer

```bash
# 1-year standard license
go run ./cmd/keygen --private private.key --years 1

# 2-year professional license
go run ./cmd/keygen --private private.key --years 2 --type professional

# Key expiring on a specific date
go run ./cmd/keygen --private private.key --expiry 2028-12-31

# Inspect / verify an existing key
go run ./cmd/keygen --verify "EASINESS-eyJ..."
```

### License types

| Type | Flag |
|------|------|
| Standard (default) | `--type standard` |
| Professional | `--type professional` |
| Enterprise | `--type enterprise` |

### User experience

- On first launch the app shows a **License Activation** screen.
- The user enters their key and clicks **Activate**.
- Once activated, the key is stored in the local SQLite database.
- When ≤ 30 days remain, the topbar shows a yellow badge; ≤ 7 days shows red.
- When the license expires the app returns to the activation screen until a new key is entered.

---

## Project Structure

```
easiness-wails/
├── main.go                 # Wails entry point
├── app.go                  # App struct — all Go methods bound to frontend
├── go.mod / go.sum
├── wails.json              # Wails configuration
├── Makefile                # Build targets for all platforms
├── cmd/
│   └── keygen/             # Seller-only license key generator CLI
├── build/                  # Build artefacts and app icons
├── internal/
│   ├── db/
│   │   ├── database.go     # GORM + SQLite init + AutoMigrate
│   │   └── seed.go         # Seed initial data (units, conversions)
│   ├── models/             # GORM entity structs (12 files)
│   ├── dto/                # Request/response types (12 files)
│   ├── service/            # Business logic (12 service files)
│   └── license/            # Ed25519 license crypto + embedded public key
├── tests/
│   └── service/            # Go backend tests (TDD)
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── svelte.config.js
    ├── src/
    │   ├── App.svelte       # Root component + auth + license gate
    │   ├── main.ts
    │   ├── stores/          # Svelte writable stores (auth, units, accounts, ui)
    │   ├── lib/             # Format utilities (replaces Angular pipes)
    │   ├── components/
    │   │   └── shared/      # Sidebar, Topbar, Modal, Pagination, Spinner, Toast
    │   ├── routes/
    │   │   ├── license/     # LicensePage (activation + expired state)
    │   │   ├── dashboard/
    │   │   ├── product/
    │   │   ├── people/
    │   │   ├── accounting/
    │   │   ├── business/
    │   │   ├── place/
    │   │   └── stock/
    │   └── wailsjs/         # Auto-generated by `wails generate module`
    │       ├── go/main/     # Go method bindings (TypeScript)
    │       └── runtime/     # Wails runtime utilities
    └── tests/               # Vitest frontend tests
```

---

## Migration Notes

This project is a clean rewrite. The original app is in `../easiness-ui/`.
See `FEASIBILITY.md` for a full analysis and `MIGRATION_PLAN.md` for the phased plan.
