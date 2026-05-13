# Windows Build Assets

Place the following files in this directory before running `wails build`:

## Required

| File | Format | Size | Purpose |
|------|--------|------|---------|
| `icon.ico` | ICO (multi-resolution) | 16×16 to 256×256 | Application icon in taskbar, Explorer, title bar |

## Generating the ICO

1. Start with a 512×512 or 1024×1024 PNG of your logo.
2. Use one of these tools to convert to `.ico`:
   - **ImageMagick** (free): `magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico`
   - **Online**: https://www.icoconverter.com/
   - **Inkscape**: Export as ICO directly

## NSIS Installer (optional)

Running `wails build -nsis` produces an NSIS installer (`*-amd64-installer.exe`) in addition to the portable `.exe`.

To customise the installer, edit the generated `.nsis` file in `build/bin/` before calling `makensis`.

## Build Commands

```powershell
# From easiness-wails/ directory:
wails build -production                          # portable .exe
wails build -production -nsis                    # NSIS installer
wails build -production -platform windows/arm64  # ARM64 (Surface Pro X, etc.)
```

## Signing (optional but recommended)

To avoid SmartScreen warnings, sign the executable with a code-signing certificate:

```powershell
# Using signtool (part of Windows SDK):
signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /a build\bin\easiness.exe
```
