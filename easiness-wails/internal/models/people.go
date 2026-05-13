package models

import "github.com/shopspring/decimal"

type PeopleType string

const (
	PeopleTypeCustomer PeopleType = "CUSTOMER"
	PeopleTypeSupplier PeopleType = "SUPPLIER"
	PeopleTypeBoth     PeopleType = "BOTH"
)

type People struct {
	Base
	Name          string          `gorm:"not null;uniqueIndex:idx_people_name_company" json:"name"`
	CompanyName   string          `gorm:"not null;uniqueIndex:idx_people_name_company" json:"companyName"`
	Address       string          `json:"address"`
	Type          PeopleType      `gorm:"not null"                                     json:"type"`
	Email         string          `json:"email"`
	Balance       decimal.Decimal `gorm:"type:text;not null;default:'0'"               json:"balance"`
	ContactNoList []ContactNo     `gorm:"foreignKey:OwnerID;constraint:OnDelete:CASCADE" json:"contactNoList"`
}

type ContactNo struct {
	ID      uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	OwnerID uint   `gorm:"not null;index"           json:"ownerId"`
	No      string `gorm:"not null"                 json:"no"`
}
