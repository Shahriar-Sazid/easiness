# Linux Build Assets

Place the following files in this directory before running `wails build` on Linux:

## Required

| File | Format | Size | Purpose |
|------|--------|------|---------|
| `icon.png` | PNG | 512×512 | App icon |

## Optional (for .desktop integration and AppImage)

| File | Purpose |
|------|---------|
| `easiness.desktop` | Desktop entry for app launchers |

## Sample `easiness.desktop`

```ini
[Desktop Entry]
Name=Easiness
Comment=Business Management Application
Exec=/usr/local/bin/easiness
Icon=easiness
Terminal=false
Type=Application
Categories=Office;Finance;
StartupNotify=true
```

## Build Commands

```bash
# From easiness-wails/ directory:
wails build -production                          # binary
wails build -production -platform linux/amd64   # explicit arch
wails build -production -platform linux/arm64   # ARM64 (Raspberry Pi, etc.)
```

## Packaging Options

### AppImage (recommended — works on any distro without install)
```bash
make package-linux-appimage
# Output: build/bin/Easiness-x86_64.AppImage
```

### Debian/Ubuntu .deb
```bash
# Install fpm: gem install fpm
fpm -s dir -t deb \
  --name easiness \
  --version 1.0.0 \
  --architecture amd64 \
  --description "Business Management Application" \
  --url "https://github.com/easiness/easiness-wails" \
  --maintainer "Easiness Team" \
  build/bin/easiness=/usr/local/bin/easiness \
  build/linux/icon.png=/usr/share/icons/hicolor/512x512/apps/easiness.png \
  build/linux/easiness.desktop=/usr/share/applications/easiness.desktop
```

### RPM (Fedora/RHEL)
```bash
fpm -s dir -t rpm \
  --name easiness --version 1.0.0 --architecture x86_64 \
  build/bin/easiness=/usr/local/bin/easiness
```

## System Dependencies (build machine only)

```bash
sudo apt-get install -y \
  gcc \
  libgtk-3-dev \
  libwebkit2gtk-4.0-dev \
  pkg-config
```

These are **build-time only** — the resulting binary links WebKit2GTK dynamically,
so users need it installed (it ships by default on most major distros).
