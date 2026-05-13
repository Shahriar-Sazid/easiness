package models

import "github.com/shopspring/decimal"

type AccountType string

const (
	AccountTypeCash AccountType = "CASH"
	AccountTypeBank AccountType = "BANK"
)

type Account struct {
	Base
	Type        AccountType     `gorm:"not null"                                    json:"type"`
	AccountName string          `gorm:"uniqueIndex;not null"                        json:"accountName"`
	HolderName  string          `gorm:"not null"                                    json:"holderName"`
	Bank        string          `json:"bank"`
	Branch      string          `json:"branch"`
	AccountNo   string          `gorm:"not null"                                    json:"accountNo"`
	Balance     decimal.Decimal `gorm:"type:text;not null;default:'0'"              json:"balance"`
}
