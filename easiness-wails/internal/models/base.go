package models

import (
	"time"

	"github.com/easiness/easiness-wails/internal/uid"
	"gorm.io/gorm"
)

// Base mirrors the TypeORM Base entity — id, timestamps, soft delete.
// SyncID is a ULID assigned on first create; it is the cross-device identity
// used by the sync protocol. The integer ID is local-only and never synced.
type Base struct {
	ID        uint           `gorm:"primaryKey;autoIncrement"   json:"id"`
	SyncID    string         `gorm:"uniqueIndex;size:26"        json:"syncId"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index"                      json:"-"`
}

// BeforeCreate auto-assigns a ULID if SyncID was not set by the caller.
func (b *Base) BeforeCreate(tx *gorm.DB) error {
	if b.SyncID == "" {
		b.SyncID = uid.New()
	}
	return nil
}
