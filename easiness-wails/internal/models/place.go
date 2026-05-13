package models

type Place struct {
	Base
	Name    string `gorm:"uniqueIndex;not null" json:"name"`
	Address string `gorm:"not null"             json:"address"`
}
