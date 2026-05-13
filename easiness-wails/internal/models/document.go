package models

import "github.com/shopspring/decimal"

type DocumentType string

const (
	DocumentTypePurchaseOrder DocumentType = "PURCHASE_ORDER"
	DocumentTypeInvoice       DocumentType = "INVOICE"
)

type Document struct {
	Base
	PeopleID uint            `gorm:"not null;index"                             json:"peopleId"`
	People   People          `gorm:"foreignKey:PeopleID"                        json:"people,omitempty"`
	Type     DocumentType    `gorm:"not null"                                   json:"type"`
	Total    decimal.Decimal `gorm:"type:text;not null"                         json:"total"`
	Profit   decimal.Decimal `gorm:"type:text"                                  json:"profit"`
	Items    []DocumentItem  `gorm:"foreignKey:DocumentID;constraint:OnDelete:CASCADE" json:"items,omitempty"`
	Payments []Tx            `gorm:"foreignKey:DocumentID"                      json:"payments,omitempty"`
}

type DocumentItem struct {
	ID              uint            `gorm:"primaryKey;autoIncrement"    json:"id"`
	DocumentID      uint            `gorm:"not null;index"              json:"documentId"`
	Document        Document        `gorm:"foreignKey:DocumentID"       json:"-"`
	ProductID       uint            `gorm:"not null"                    json:"productId"`
	Product         Product         `gorm:"foreignKey:ProductID"        json:"product,omitempty"`
	Quantity        decimal.Decimal `gorm:"type:text;not null"          json:"quantity"`
	Cost            decimal.Decimal `gorm:"type:text;not null"          json:"cost"`
	Price           decimal.Decimal `gorm:"type:text"                   json:"price"`
	UnitID          uint            `gorm:"not null"                    json:"unitId"`
	Unit            Unit            `gorm:"foreignKey:UnitID"           json:"unit,omitempty"`
	PlaceID         uint            `json:"placeId"`
	Place           Place           `gorm:"foreignKey:PlaceID"          json:"place,omitempty"`
	AffectedStockID uint            `json:"affectedStockId"`
	AffectedStock   Stock           `gorm:"foreignKey:AffectedStockID"  json:"affectedStock,omitempty"`
}
