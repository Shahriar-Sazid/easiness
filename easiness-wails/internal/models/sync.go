package models

import "time"

// SyncLog records every mutation (INSERT / UPDATE / DELETE) on synced tables.
// The primary key is a ULID, so rows are naturally ordered by creation time.
// This makes cursor-based sync trivial: "give me all rows WHERE id > last_cursor".
type SyncLog struct {
	ID        string    `gorm:"primaryKey;size:26"        json:"id"`       // ULID
	DeviceID  string    `gorm:"not null;index;size:26"    json:"deviceId"` // ULID of originating device
	TableName string    `gorm:"not null;size:64"          json:"table"`
	SyncID    string    `gorm:"not null;index;size:26"    json:"syncId"`   // ULID of the affected record
	Op        string    `gorm:"not null;size:8"           json:"op"`       // INSERT | UPDATE | DELETE
	Payload   string    `gorm:"type:text"                 json:"payload"`  // JSON snapshot of the record
	CreatedAt time.Time `gorm:"not null;index"            json:"createdAt"`
}

// DeviceRegistration tracks known sync clients so the server can filter
// out a device's own entries when responding to pull requests.
type DeviceRegistration struct {
	ID          string    `gorm:"primaryKey;size:26"     json:"id"`       // ULID (the device's identity)
	Name        string    `gorm:"size:128"               json:"name"`     // human-readable label
	LastSeenAt  time.Time `gorm:"index"                  json:"lastSeenAt"`
	LastCursor  string    `gorm:"size:26"                json:"lastCursor"` // last pull cursor
	RegisteredAt time.Time `gorm:"not null"              json:"registeredAt"`
}
