package dto

import "github.com/shopspring/decimal"

type SaveAccountRequest struct {
	ID          uint            `json:"id"`
	Type        string          `json:"type"`
	AccountName string          `json:"accountName"`
	HolderName  string          `json:"holderName"`
	Bank        string          `json:"bank"`
	Branch      string          `json:"branch"`
	AccountNo   string          `json:"accountNo"`
	Balance     decimal.Decimal `json:"balance"`
}

type AccountSearchRequest struct {
	SearchRequest
	AccountNo   string `json:"accountNo"`
	AccountName string `json:"accountName"`
	HolderName  string `json:"holderName"`
}

type AccountResponse struct {
	ID          uint            `json:"id"`
	Type        string          `json:"type"`
	AccountName string          `json:"accountName"`
	HolderName  string          `json:"holderName"`
	Bank        string          `json:"bank"`
	Branch      string          `json:"branch"`
	AccountNo   string          `json:"accountNo"`
	Balance     decimal.Decimal `json:"balance"`
}
