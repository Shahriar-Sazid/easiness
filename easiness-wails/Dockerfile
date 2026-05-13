# ── Stage 1: Build the Svelte frontend ────────────────────────────────────────
FROM node:20-alpine AS frontend
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci --prefer-offline
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build the Go server binary ───────────────────────────────────────
# The server uses PostgreSQL (pure-Go driver) — no CGo, no GCC needed.
FROM golang:1.21-alpine AS server
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build \
      -ldflags="-s -w" \
      -o easiness-server \
      ./cmd/server

# ── Stage 3: Minimal runtime image ────────────────────────────────────────────
FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata

# Server binary
COPY --from=server /build/easiness-server /usr/local/bin/easiness-server

# Pre-built Svelte assets served by Echo's Static() handler
COPY --from=frontend /build/dist /app/frontend/dist

ENV FRONTEND_DIR=/app/frontend/dist
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["easiness-server"]
