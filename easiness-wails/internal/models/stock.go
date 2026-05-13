package models

import "github.com/shopspring/decimal"

type Stock struct {
	Base
	ProductID   uint            `gorm:"not null;uniqueIndex:idx_stock_product_place" json:"productId"`
	Product     Product         `gorm:"foreignKey:ProductID"                         json:"product,omitempty"`
	Cost        decimal.Decimal `gorm:"type:text;not null"                           json:"cost"`
	LatestPrice decimal.Decimal `gorm:"type:text"                                    json:"latestPrice"`
	Quantity    decimal.Decimal `gorm:"type:text;not null;default:'0'"               json:"quantity"`
	UnitID      uint            `gorm:"not null"                                     json:"unitId"`
	Unit        Unit            `gorm:"foreignKey:UnitID"                            json:"unit,omitempty"`
	PlaceID     uint            `gorm:"not null;uniqueIndex:idx_stock_product_place" json:"placeId"`
	Place       Place           `gorm:"foreignKey:PlaceID"                           json:"place,omitempty"`
}
