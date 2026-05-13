# macOS Build Assets

Place the following files in this directory before running `wails build` on macOS:

## Required

| File | Format | Size | Purpose |
|------|--------|------|---------|
| `icon.icns` | ICNS | 1024×1024 source | App icon in Dock, Launchpad, Finder |

## Generating the ICNS

```bash
# From a 1024×1024 PNG:
mkdir MyIcon.iconset
sips -z 16  16   icon.png --out MyIcon.iconset/icon_16x16.png
sips -z 32  32   icon.png --out MyIcon.iconset/icon_16x16@2x.png
sips -z 32  32   icon.png --out MyIcon.iconset/icon_32x32.png
sips -z 64  64   icon.png --out MyIcon.iconset/icon_32x32@2x.png
sips -z 128 128  icon.png --out MyIcon.iconset/icon_128x128.png
sips -z 256 256  icon.png --out MyIcon.iconset/icon_128x128@2x.png
sips -z 256 256  icon.png --out MyIcon.iconset/icon_256x256.png
sips -z 512 512  icon.png --out MyIcon.iconset/icon_256x256@2x.png
sips -z 512 512  icon.png --out MyIcon.iconset/icon_512x512.png
cp icon.png      MyIcon.iconset/icon_512x512@2x.png
iconutil -c icns MyIcon.iconset -o build/darwin/icon.icns
```

## Build Commands

```bash
# From easiness-wails/ directory:
wails build -production                           # Intel (.app bundle)
wails build -production -platform darwin/arm64    # Apple Silicon
wails build -production -platform darwin/universal # Universal binary (both archs)
```

Then package as DMG:
```bash
make package-mac
# or manually:
hdiutil create -volname "Easiness" -srcfolder build/bin/easiness.app \
  -ov -format UDZO build/bin/Easiness.dmg
```

## Signing & Notarization (required for distribution outside Mac App Store)

```bash
# Sign the app bundle:
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Your Name (XXXXXXXXXX)" \
  --options runtime \
  build/bin/easiness.app

# Submit for notarization:
xcrun notarytool submit build/bin/Easiness.dmg \
  --apple-id "your@email.com" \
  --password "@keychain:AC_PASSWORD" \
  --team-id "XXXXXXXXXX" \
  --wait

# Staple the ticket:
xcrun stapler staple build/bin/Easiness.dmg
```

Without notarization, Gatekeeper will block the app on user machines.
