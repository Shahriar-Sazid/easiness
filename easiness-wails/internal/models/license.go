package models

import "time"

// StoredLicense holds the activated license key and its parsed metadata.
// Only one row is ever present (the currently active license).
type StoredLicense struct {
	ID         uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Key        string    `gorm:"not null;uniqueIndex"    json:"key"`
	Type       string    `gorm:"not null"                json:"type"`
	Seats      int       `gorm:"not null;default:1"      json:"seats"`
	ExpiresAt  time.Time `gorm:"not null"                json:"expiresAt"`
	ActivatedAt time.Time `gorm:"not null"               json:"activatedAt"`
}
