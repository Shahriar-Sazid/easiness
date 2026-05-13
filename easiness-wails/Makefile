# Easiness — build targets
# Requires: Go 1.21+, Wails CLI, Node 18+, GCC (CGo for SQLite)
#
# NOTE: Cross-compilation is NOT supported because SQLite uses CGo.
# Build each platform on its own native machine or use GitHub Actions (see .github/workflows/build.yml).

.PHONY: dev build build-prod build-server test test-frontend test-sync clean \
        docker-build docker-up docker-down docker-logs help

# ── Development ──────────────────────────────────────────────────────────────

dev:          ## Start hot-reload dev server (Go + Svelte)
	wails dev

# ── Testing ───────────────────────────────────────────────────────────────────

test:         ## Run all Go backend tests
	go test ./... -v -count=1

test-cover:   ## Run tests with coverage report
	go test ./... -coverprofile=coverage.out
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report: coverage.html"

test-frontend: ## Run Vitest frontend tests
	cd frontend && npm test

test-sync:    ## Run sync integration tests only
	go test ./tests/sync/... -v -count=1

test-all:     ## Run all tests (backend + frontend + sync)
	$(MAKE) test
	$(MAKE) test-frontend
	$(MAKE) test-sync

# ── Building ──────────────────────────────────────────────────────────────────

build:        ## Development build for current platform
	wails build

build-prod:   ## Production build (no devtools, optimised)
	wails build -production

build-server: ## Build the HTTP server binary (no CGo — any platform)
	CGO_ENABLED=0 go build -ldflags="-s -w" -o build/bin/easiness-server ./cmd/server
	@echo "Output: build/bin/easiness-server"

# ── Platform-specific builds (run on the matching native OS) ─────────────────

build-windows: ## [Windows only] Build Windows NSIS installer + portable exe
	wails build -production -platform windows/amd64 -nsis
	@echo "Output: build/bin/easiness-amd64-installer.exe"

build-mac-intel: ## [macOS Intel only] Build macOS app bundle
	wails build -production -platform darwin/amd64
	@echo "Output: build/bin/easiness.app"

build-mac-arm: ## [macOS Apple Silicon only] Build macOS app bundle
	wails build -production -platform darwin/arm64
	@echo "Output: build/bin/easiness.app"

build-linux:  ## [Linux only] Build Linux binary
	wails build -production -platform linux/amd64
	@echo "Output: build/bin/easiness"

# ── Packaging helpers (run after the matching build-* target) ─────────────────

package-mac:  ## [macOS only] Wrap .app into a DMG
	@which create-dmg || brew install create-dmg
	create-dmg \
		--volname "Easiness" \
		--window-size 600 400 \
		--icon-size 100 \
		--icon "easiness.app" 175 190 \
		--app-drop-link 425 190 \
		"build/bin/Easiness.dmg" \
		"build/bin/easiness.app"
	@echo "Output: build/bin/Easiness.dmg"

package-linux-appimage: ## [Linux only] Build AppImage (requires appimagetool)
	@which appimagetool || (echo "Install: https://appimage.github.io/appimagetool/" && exit 1)
	mkdir -p build/AppDir/usr/bin build/AppDir/usr/share/applications
	cp build/bin/easiness build/AppDir/usr/bin/
	cp build/linux/easiness.png build/AppDir/usr/share/icons/easiness.png || true
	cp build/linux/easiness.desktop build/AppDir/usr/share/applications/ || true
	ARCH=x86_64 appimagetool build/AppDir build/bin/Easiness-x86_64.AppImage
	@echo "Output: build/bin/Easiness-x86_64.AppImage"

# ── Housekeeping ──────────────────────────────────────────────────────────────

# ── Docker ────────────────────────────────────────────────────────────────────

docker-build: ## Build the Docker image
	docker build -t easiness-server .

docker-up:    ## Start server + PostgreSQL via docker-compose
	docker compose up -d
	@echo "Server running at http://localhost:$${PORT:-8080}"

docker-down:  ## Stop containers (data is preserved in postgres_data volume)
	docker compose down

docker-logs:  ## Follow server logs
	docker compose logs -f server

# ── Housekeeping ──────────────────────────────────────────────────────────────

generate:     ## Regenerate Wails JS bindings (run after adding/changing Go methods)
	wails generate module

deps:         ## Download and tidy Go + NPM dependencies
	go mod tidy
	cd frontend && npm install

clean:        ## Remove build artefacts
	rm -rf build/bin coverage.out coverage.html
	cd frontend && rm -rf dist node_modules

help:         ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'
