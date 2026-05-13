package sync

import (
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// tableRegistry maps GORM table names to zero-value model constructors.
var tableRegistry = map[string]func() any{
	"accounts":         func() any { return &models.Account{} },
	"people":           func() any { return &models.People{} },
	"contact_nos":      func() any { return &models.ContactNo{} },
	"products":         func() any { return &models.Product{} },
	"places":           func() any { return &models.Place{} },
	"units":            func() any { return &models.Unit{} },
	"unit_conversions": func() any { return &models.UnitConversion{} },
	"documents":        func() any { return &models.Document{} },
	"document_items":   func() any { return &models.DocumentItem{} },
	"txes":             func() any { return &models.Tx{} },
	"stocks":           func() any { return &models.Stock{} },
}

// Apply upserts a batch of SyncLog entries into the local database.
// Writes use SkipSyncLog to avoid re-logging applied entries.
func Apply(db *gorm.DB, entries []models.SyncLog) error {
	for _, entry := range entries {
		if err := applyOne(db, entry); err != nil {
			fmt.Printf("[sync/applier] skipping %s (%s.%s): %v\n", entry.ID, entry.TableName, entry.SyncID, err)
		}
		// Record the SyncLog entry itself so the cursor advances.
		SkipSyncLog(db).Where(models.SyncLog{ID: entry.ID}).FirstOrCreate(&entry)
	}
	return nil
}

func applyOne(db *gorm.DB, entry models.SyncLog) error {
	factory, ok := tableRegistry[entry.TableName]
	if !ok {
		return nil // unknown table — skip silently
	}

	record := factory()
	if err := json.Unmarshal([]byte(entry.Payload), record); err != nil {
		return fmt.Errorf("unmarshal: %w", err)
	}

	// Clear the integer PK so GORM auto-assigns a local one.
	// Cross-device identity is established exclusively by sync_id.
	clearIntID(record)

	sess := SkipSyncLog(db)

	switch entry.Op {
	case "INSERT", "UPDATE":
		return sess.Table(entry.TableName).
			Clauses(clause.OnConflict{
				Columns:   []clause.Column{{Name: "sync_id"}},
				DoUpdates: clause.AssignmentColumns(updatableColumns(entry.TableName)),
			}).
			Create(record).Error

	case "DELETE":
		return sess.Table(entry.TableName).
			Where("sync_id = ?", entry.SyncID).
			Delete(record).Error

	default:
		return fmt.Errorf("unknown op %q", entry.Op)
	}
}

// clearIntID zeros the ID field so GORM auto-increments a fresh local key.
func clearIntID(record any) {
	v := reflect.ValueOf(record)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}
	if f := v.FieldByName("ID"); f.IsValid() && f.CanSet() && f.Kind() == reflect.Uint {
		f.SetUint(0)
	}
}

// updatableColumns returns the columns overwritten on conflict.
// Financial records are append-only — return nil so nothing is overwritten.
func updatableColumns(table string) []string {
	appendOnly := map[string]bool{
		"documents": true, "document_items": true, "txes": true,
	}
	if appendOnly[table] {
		return nil
	}
	return []string{
		"updated_at", "deleted_at",
		"name", "address", "type", "company_name", "email", "balance",
		"account_no", "account_name", "holder_name", "bank", "branch",
		"brand", "country", "size", "preferred_unit",
	}
}
