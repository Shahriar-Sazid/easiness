package models

import "github.com/shopspring/decimal"

type TxType string

const (
	TxTypeIncome       TxType = "INCOME"
	TxTypeExpense      TxType = "EXPENSE"
	TxTypeBankTransfer TxType = "BANK_TRANSFER"
)

type Tx struct {
	Base
	Amount        decimal.Decimal `gorm:"type:text;not null"      json:"amount"`
	FromAccountID uint            `gorm:"index"                   json:"fromAccountId"`
	FromAccount   Account         `gorm:"foreignKey:FromAccountID" json:"fromAccount,omitempty"`
	ToAccountID   uint            `gorm:"index"                   json:"toAccountId"`
	ToAccount     Account         `gorm:"foreignKey:ToAccountID"  json:"toAccount,omitempty"`
	DocumentID    uint            `gorm:"index"                   json:"documentId"`
	Document      Document        `gorm:"foreignKey:DocumentID"   json:"document,omitempty"`
	PeopleID      uint            `gorm:"index"                   json:"peopleId"`
	People        People          `gorm:"foreignKey:PeopleID"     json:"people,omitempty"`
	Ref           string          `json:"ref"`
	Type          TxType          `gorm:"not null"                json:"type"`
	Meta          string          `json:"meta"`
	Description   string          `json:"description"`
}
