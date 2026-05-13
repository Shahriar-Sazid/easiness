package dto

import "github.com/shopspring/decimal"

type StockSearchRequest struct {
	SearchRequest
	ProductID uint `json:"productId"`
	PlaceID   uint `json:"placeId"`
}

type StockResponse struct {
	ID          uint            `json:"id"`
	ProductID   uint            `json:"productId"`
	Product     *ProductResponse `json:"product,omitempty"`
	Cost        decimal.Decimal `json:"cost"`
	LatestPrice decimal.Decimal `json:"latestPrice"`
	Quantity    decimal.Decimal `json:"quantity"`
	UnitID      uint            `json:"unitId"`
	Unit        *UnitDTO        `json:"unit,omitempty"`
	PlaceID     uint            `json:"placeId"`
	Place       *PlaceResponse  `json:"place,omitempty"`
}

type InitialStockRequest struct {
	ProductID uint            `json:"productId"`
	PlaceID   uint            `json:"placeId"`
	UnitID    uint            `json:"unitId"`
	Quantity  decimal.Decimal `json:"quantity"`
	Cost      decimal.Decimal `json:"cost"`
}
