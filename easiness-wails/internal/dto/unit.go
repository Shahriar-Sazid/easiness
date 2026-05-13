package dto

import "github.com/shopspring/decimal"

type UnitDTO struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

type UnitConversionDTO struct {
	ID       uint            `json:"id"`
	From     uint            `json:"from"`
	To       uint            `json:"to"`
	CalStep  int             `json:"calStep"`
	Operator string          `json:"operator"`
	Constant decimal.Decimal `json:"constant"`
}

type UnitDataResponse struct {
	Units       []UnitDTO           `json:"units"`
	Conversions []UnitConversionDTO `json:"conversions"`
}
