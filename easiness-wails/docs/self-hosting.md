# Self-Hosting Easiness Server

This guide explains how to run the Easiness web server on your own machine or VPS
so that the desktop app and browser can sync data.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Docker | 24+ | https://docs.docker.com/get-docker/ |
| Docker Compose | v2 | Bundled with Docker Desktop |

That's all. No Go or Node needed on the server.

---

## Quick start

### 1. Clone (or copy) the repo

```bash
git clone https://github.com/your-org/easiness.git
cd easiness/easiness-wails
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL password (pick something strong)
POSTGRES_PASSWORD=replace-with-strong-password

# JWT signing secret — must be ≥ 32 random characters
# Generate one: openssl rand -base64 48
JWT_SECRET=replace-with-at-least-32-random-characters-here

# Port the server listens on (default: 8080)
PORT=8080
```

**Never commit `.env` to version control.**

### 3. Start the stack

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on an internal Docker network (not exposed externally)
- **Easiness server** on port 8080 (API + web frontend)

### 4. Open the web app

Navigate to `http://your-server-ip:8080` in a browser.
On first visit you will be prompted to set a password.

### 5. Configure the desktop app to sync

In the desktop Wails app, call `ConfigureSync` with:
- **Server URL**: `http://your-server-ip:8080`
- **Device ID**: register once via `POST /api/sync/register`

---

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | auto (compose) | — | PostgreSQL DSN |
| `JWT_SECRET` | yes | — | ≥ 32 chars; signs access tokens |
| `POSTGRES_PASSWORD` | yes | `changeme` | PostgreSQL user password |
| `PORT` | no | `8080` | HTTP listen port |
| `FRONTEND_DIR` | no | `/app/frontend/dist` | Path to built Svelte assets |

---

## HTTPS (recommended for production)

Put a reverse proxy in front of the server. Example with **Caddy** (auto HTTPS):

```caddyfile
easiness.yourdomain.com {
    reverse_proxy localhost:8080
}
```

Example with **nginx**:

```nginx
server {
    listen 443 ssl;
    server_name easiness.yourdomain.com;
    ssl_certificate     /etc/ssl/certs/easiness.crt;
    ssl_certificate_key /etc/ssl/private/easiness.key;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Updating

```bash
git pull
docker compose build --no-cache
docker compose up -d
```

Schema migrations run automatically on startup via GORM AutoMigrate.

---

## Backup

The only stateful component is PostgreSQL. Back up with:

```bash
# Dump
docker compose exec postgres \
  pg_dump -U easiness easiness > backup-$(date +%Y%m%d).sql

# Restore
cat backup-20260101.sql | docker compose exec -T postgres \
  psql -U easiness easiness
```

---

## Logs

```bash
docker compose logs -f server    # server logs
docker compose logs -f postgres  # database logs
```

---

## Health check

```bash
curl http://localhost:8080/api/health
# {"status":"ok"}
```

---

## Stopping

```bash
docker compose down          # stop containers, keep data
docker compose down -v       # stop containers AND delete database volume
```
