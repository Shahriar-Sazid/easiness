package dto

import (
	"time"

	"github.com/shopspring/decimal"
)

type TxSearchRequest struct {
	SearchRequest
	Type        string    `json:"type"`
	PeopleID    uint      `json:"peopleId"`
	AccountID   uint      `json:"accountId"`
	DocumentID  uint      `json:"documentId"`
	DateFrom    time.Time `json:"dateFrom"`
	DateTo      time.Time `json:"dateTo"`
}

type TxResponse struct {
	ID            uint            `json:"id"`
	Amount        decimal.Decimal `json:"amount"`
	FromAccountID uint            `json:"fromAccountId"`
	FromAccount   *AccountResponse `json:"fromAccount,omitempty"`
	ToAccountID   uint            `json:"toAccountId"`
	ToAccount     *AccountResponse `json:"toAccount,omitempty"`
	DocumentID    uint            `json:"documentId"`
	PeopleID      uint            `json:"peopleId"`
	People        *PeopleResponse `json:"people,omitempty"`
	Ref           string          `json:"ref"`
	Type          string          `json:"type"`
	Description   string          `json:"description"`
	CreatedAt     time.Time       `json:"createdAt"`
}

// PaymentInput is used when creating a document with payments.
type PaymentInput struct {
	Amount        decimal.Decimal `json:"amount"`
	FromAccountID uint            `json:"fromAccount"`
	ToAccountID   uint            `json:"toAccount"`
}
