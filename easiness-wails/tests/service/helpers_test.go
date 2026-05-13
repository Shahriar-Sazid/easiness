package service_test

import (
	"testing"

	"github.com/easiness/easiness-wails/internal/db"
	"gorm.io/gorm"
)

// newTestDB returns a fresh in-memory SQLite database for each test.
func newTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	database, err := db.InitializeTest()
	if err != nil {
		t.Fatalf("failed to init test db: %v", err)
	}
	return database
}
