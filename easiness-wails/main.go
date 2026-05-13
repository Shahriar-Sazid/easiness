package main

import (
	"embed"
	"log"

	"github.com/easiness/easiness-wails/internal/db"
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
