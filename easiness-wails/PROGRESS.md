# Migration Progress Tracker

**Last updated:** 2026-05-13  
**Current phase:** Phase 0 — Project Skeleton  
**Last completed checkpoint:** None yet

---

## Completed Checkpoints

| Checkpoint | Description | Date |
|-----------|-------------|------|
| — | — | — |

---

## Current Status

### Phase 0 — Project Skeleton

- [x] Directory structure created
- [x] FEASIBILITY.md written
- [x] MIGRATION_PLAN.md written
- [x] PROGRESS.md written (this file)
- [x] README.md written
- [x] go.mod written
- [x] wails.json written
- [x] main.go written
- [x] app.go written (stub + full service wiring)
- [x] internal/db/database.go written
- [x] internal/models/ written (all 11 entity structs)
- [x] internal/dto/ written (all DTO structs)
- [x] internal/service/ written (all 10 services)
- [x] tests/service/ written (TDD tests for all services)
- [x] frontend/package.json written
- [x] frontend/vite.config.ts written
- [x] frontend/svelte.config.js written
- [x] frontend/tsconfig.json written
- [x] frontend/index.html written
- [x] frontend/src/main.ts written
- [x] frontend/src/App.svelte written (with routing)
- [x] frontend/src/stores/ written (auth, units, people, products, accounts, ui)
- [x] frontend/src/types/ written
- [x] frontend/src/lib/ written (format utilities)
- [x] frontend/src/components/shared/ written
- [x] frontend/src/routes/ written (all pages)
- [x] frontend tests written

---

## In-Progress Task

None — all initial tasks complete. Ready for Phase 1 prerequisite: install Go + Wails.

---

## Next Steps

1. Install prerequisites (see README.md → Installation section)
2. Run `wails doctor` to verify environment
3. Run `go test ./...` to verify backend tests pass
4. Run `wails dev` to start the dev server
5. Open http://localhost:34115 (or the URL printed by Wails)

---

## Known Issues / Blockers

| Issue | Status | Notes |
|-------|--------|-------|
| Go not installed on dev machine | Blocking Phase 1+ | Install from https://go.dev/dl/ |
| Wails CLI not installed | Blocking Phase 5+ | `go install github.com/wailsapp/wails/v2/cmd/wails@latest` |
| CGo/GCC required for SQLite | Blocking build | Install MSYS2 + mingw-w64-x86_64-gcc |

---

## Session Resumption Checklist

If resuming after a break, run these commands to verify state:

```powershell
# 1. Check Go installation
go version

# 2. Check Wails installation
wails version

# 3. Check backend compiles
cd easiness-wails
go build ./...

# 4. Run backend tests
go test ./...

# 5. Check frontend
cd frontend
npm install
npm run check

# 6. Start dev server
cd ..
wails dev
```
