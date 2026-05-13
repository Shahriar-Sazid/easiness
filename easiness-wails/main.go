package main

import (
	"embed"
	"log"

	"github.com/easiness/easiness-wails/internal/db"
	internalsync "github.com/easiness/easiness-wails/internal/sync"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	database, err := db.Initialize()
	if err != nil {
		log.Fatal("database init failed:", err)
	}

	// Register sync hooks so every local write is logged.
	// The device ID is loaded from settings (empty string = sync not yet configured).
	internalsync.RegisterCallbacks(database, "")

	app := NewApp(database)

	if err := wails.Run(&options.App{
		Title:  "Easiness",
		Width:  1400,
		Height: 900,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	}); err != nil {
		log.Fatal(err)
	}
}
