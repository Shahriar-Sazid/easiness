package models

import "github.com/shopspring/decimal"

type Unit struct {
	ID   uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	Name string `gorm:"not null"                 json:"name"`
}

type UnitConversion struct {
	ID       uint            `gorm:"primaryKey;autoIncrement" json:"id"`
	From     uint            `gorm:"column:from_unit;not null" json:"from"`
	To       uint            `gorm:"column:to_unit;not null"   json:"to"`
	CalStep  int             `gorm:"column:cal_step;not null"  json:"calStep"`
	Operator string          `gorm:"not null"                  json:"operator"`
	Constant decimal.Decimal `gorm:"type:text;not null"        json:"constant"`
}
