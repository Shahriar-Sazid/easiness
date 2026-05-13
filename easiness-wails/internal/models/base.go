package models

import (
	"time"

	"gorm.io/gorm"
)

// Base mirrors the TypeORM Base entity — id, timestamps, soft delete.
type Base struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index"                   json:"-"`
}
