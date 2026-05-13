package dto

import (
	"time"

	"github.com/shopspring/decimal"
)

type DocumentItemInput struct {
	ProductID uint            `json:"productId"`
	Quantity  decimal.Decimal `json:"quantity"`
	Cost      decimal.Decimal `json:"cost"`
	Price     decimal.Decimal `json:"price"`
	UnitID    uint            `json:"unitId"`
	PlaceID   uint            `json:"placeId"`
}

type SaveDocumentRequest struct {
	PeopleID uint                `json:"peopleId"`
	Items    []DocumentItemInput `json:"items"`
	Payments []PaymentInput      `json:"payments"`
}

type DocumentSearchRequest struct {
	SearchRequest
	Type     string    `json:"type"`
	PeopleID uint      `json:"peopleId"`
	DateFrom time.Time `json:"dateFrom"`
	DateTo   time.Time `json:"dateTo"`
}

type DocumentItemResponse struct {
	ID        uint            `json:"id"`
	ProductID uint            `json:"productId"`
	Product   *ProductResponse `json:"product,omitempty"`
	Quantity  decimal.Decimal `json:"quantity"`
	Cost      decimal.Decimal `json:"cost"`
	Price     decimal.Decimal `json:"price"`
	UnitID    uint            `json:"unitId"`
	PlaceID   uint            `json:"placeId"`
}

type DocumentResponse struct {
	ID        uint            `json:"id"`
	PeopleID  uint            `json:"peopleId"`
	People    *PeopleResponse `json:"people,omitempty"`
	Type      string          `json:"type"`
	Total     decimal.Decimal `json:"total"`
	Profit    decimal.Decimal `json:"profit"`
	CreatedAt time.Time       `json:"createdAt"`
}

type DocumentDetailsResponse struct {
	DocumentResponse
	Items    []DocumentItemResponse `json:"items"`
	Payments []TxResponse           `json:"payments"`
}
