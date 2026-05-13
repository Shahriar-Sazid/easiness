package sync

import (
	"encoding/json"
	"time"

	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

const skipSyncLogKey = "easiness:skip_sync_log"

// RegisterCallbacks attaches global GORM callbacks that write a SyncLog entry
// after every INSERT, UPDATE, or DELETE on tables that embed models.Base.
// Call this once after opening the database.
//
// Pass deviceID = "" when setting up a server DB (the server logs the originating
// device from the push payload, not its own device ID).
func RegisterCallbacks(db *gorm.DB, deviceID string) {
	db.Callback().Create().After("gorm:create").Register("sync:log_insert", makeCallback("INSERT", deviceID))
	db.Callback().Update().After("gorm:update").Register("sync:log_update", makeCallback("UPDATE", deviceID))
	db.Callback().Delete().After("gorm:delete").Register("sync:log_delete", makeCallback("DELETE", deviceID))
}

// SkipSyncLog returns a *gorm.DB session that will not trigger sync logging.
// Use when applying received sync events to avoid re-logging them.
func SkipSyncLog(db *gorm.DB) *gorm.DB {
	return db.Session(&gorm.Session{}).Set(skipSyncLogKey, true)
}

func makeCallback(op, deviceID string) func(*gorm.DB) {
	return func(tx *gorm.DB) {
		if tx.Error != nil {
			return
		}
		// Skip if explicitly disabled for this session
		if skip, ok := tx.Get(skipSyncLogKey); ok && skip.(bool) {
			return
		}
		// Only log models that embed Base (i.e. have a SyncID field)
		type hasSyncID interface{ GetSyncID() string }
		type hasSyncIDVal interface{ SyncIDValue() string }

		var syncID string
		// Use reflection-free approach: check if the model exposes SyncID
		stmt := tx.Statement
		if stmt == nil || stmt.Model == nil {
			return
		}

		// Inspect the model via GORM's reflection helpers
		modelValue := stmt.ReflectValue
		if !modelValue.IsValid() {
			return
		}
		syncIDField := modelValue.FieldByName("SyncID")
		if !syncIDField.IsValid() || syncIDField.Kind().String() != "string" {
			return
		}
		syncID = syncIDField.String()
		if syncID == "" {
			return
		}

		payload, _ := json.Marshal(stmt.Model)

		entry := models.SyncLog{
			ID:        NewULID(),
			DeviceID:  deviceID,
			TableName: stmt.Table,
			SyncID:    syncID,
			Op:        op,
			Payload:   string(payload),
			CreatedAt: time.Now(),
		}
		// Use a separate session so this write doesn't trigger the callback again
		tx.Session(&gorm.Session{NewDB: true, SkipHooks: true}).
			Set(skipSyncLogKey, true).
			Create(&entry)
	}
}
