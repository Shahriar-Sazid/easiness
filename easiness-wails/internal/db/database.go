package db

import (
	"os"
	"path/filepath"
	"runtime"

	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Initialize() (*gorm.DB, error) {
	dbPath, err := resolveDBPath()
	if err != nil {
		return nil, err
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, err
	}

	// Enable foreign keys — SQLite disables them by default.
	if err := db.Exec("PRAGMA foreign_keys = ON").Error; err != nil {
		return nil, err
	}

	if err := migrate(db); err != nil {
		return nil, err
	}

	if err := Seed(db); err != nil {
		return nil, err
	}

	return db, nil
}

// InitializeTest returns an in-memory database for tests.
func InitializeTest() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, err
	}
	db.Exec("PRAGMA foreign_keys = ON")
	return db, migrate(db)
}

func migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.Account{},
		&models.Place{},
		&models.Unit{},
		&models.UnitConversion{},
		&models.People{},
		&models.ContactNo{},
		&models.Product{},
		&models.Stock{},
		&models.Document{},
		&models.DocumentItem{},
		&models.Tx{},
		&models.LocalAuth{},
		&models.StoredLicense{},
		&models.SyncLog{},
		&models.DeviceRegistration{},
	)
}

func resolveDBPath() (string, error) {
	var dir string

	switch runtime.GOOS {
	case "windows":
		dir = filepath.Join(os.Getenv("APPDATA"), "easiness")
	case "darwin":
		home, _ := os.UserHomeDir()
		dir = filepath.Join(home, "Library", "Application Support", "easiness")
	default:
		home, _ := os.UserHomeDir()
		dir = filepath.Join(home, ".local", "share", "easiness")
	}

	if err := os.MkdirAll(dir, 0o755); err != nil {
		return "", err
	}

	return filepath.Join(dir, "easiness.db"), nil
}
