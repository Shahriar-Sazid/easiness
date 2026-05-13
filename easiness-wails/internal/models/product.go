package models

type Product struct {
	Base
	Name          string `gorm:"not null;uniqueIndex:idx_product_unique" json:"name"`
	Type          string `gorm:"uniqueIndex:idx_product_unique"          json:"type"`
	Brand         string `gorm:"uniqueIndex:idx_product_unique"          json:"brand"`
	Country       string `gorm:"not null"                                json:"country"`
	Size          string `gorm:"uniqueIndex:idx_product_unique"          json:"size"`
	PreferredUnit uint   `gorm:"not null"                                json:"preferredUnit"`
}
