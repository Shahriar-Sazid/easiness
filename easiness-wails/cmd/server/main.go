// server — Easiness HTTP API + Web Frontend
//
// Usage:
//
//	export DATABASE_URL="postgres://user:pass@localhost:5432/easiness?sslmode=disable"
//	export JWT_SECRET="replace-with-32+-random-bytes"
//	go run ./cmd/server
package main

import (
	"fmt"
	"log"

	"github.com/easiness/easiness-wails/internal/api"
	"github.com/easiness/easiness-wails/internal/db"
	internalsync "github.com/easiness/easiness-wails/internal/sync"
)

func main() {
	cfg, err := loadConfig()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	database, err := db.InitializePostgres(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database: %v", err)
	}

	// Register sync callbacks with empty device ID (server doesn't track its own device)
	internalsync.RegisterCallbacks(database, "")

	router := api.NewRouter(database, cfg.JWTSecret, cfg.FrontendDir)

	addr := fmt.Sprintf(":%d", cfg.Port)
	log.Printf("Easiness server listening on %s", addr)
	if err := router.Start(addr); err != nil {
		log.Fatalf("server: %v", err)
	}
}
