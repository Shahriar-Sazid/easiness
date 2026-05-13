package db

import (
	"github.com/easiness/easiness-wails/internal/models"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// Seed inserts default units and conversions if the unit table is empty.
func Seed(db *gorm.DB) error {
	var count int64
	db.Model(&models.Unit{}).Count(&count)
	if count > 0 {
		return nil
	}

	units := []models.Unit{
		{ID: 1, Name: "pcs"},
		{ID: 2, Name: "dozen"},
		{ID: 3, Name: "kg"},
		{ID: 4, Name: "g"},
		{ID: 5, Name: "L"},
		{ID: 6, Name: "mL"},
		{ID: 7, Name: "m"},
		{ID: 8, Name: "cm"},
		{ID: 9, Name: "box"},
		{ID: 10, Name: "pack"},
	}

	if err := db.Clauses(clause.OnConflict{DoNothing: true}).Create(&units).Error; err != nil {
		return err
	}

	conversions := []models.UnitConversion{
		// 1 dozen = 12 pcs
		{From: 2, To: 1, CalStep: 1, Operator: "MULTIPLY", Constant: decimal.NewFromInt(12)},
		// 1 pcs = 1/12 dozen
		{From: 1, To: 2, CalStep: 1, Operator: "DIVIDE", Constant: decimal.NewFromInt(12)},
		// 1 kg = 1000 g
		{From: 3, To: 4, CalStep: 1, Operator: "MULTIPLY", Constant: decimal.NewFromInt(1000)},
		// 1 g = 0.001 kg
		{From: 4, To: 3, CalStep: 1, Operator: "DIVIDE", Constant: decimal.NewFromInt(1000)},
		// 1 L = 1000 mL
		{From: 5, To: 6, CalStep: 1, Operator: "MULTIPLY", Constant: decimal.NewFromInt(1000)},
		// 1 mL = 0.001 L
		{From: 6, To: 5, CalStep: 1, Operator: "DIVIDE", Constant: decimal.NewFromInt(1000)},
		// 1 m = 100 cm
		{From: 7, To: 8, CalStep: 1, Operator: "MULTIPLY", Constant: decimal.NewFromInt(100)},
		// 1 cm = 0.01 m
		{From: 8, To: 7, CalStep: 1, Operator: "DIVIDE", Constant: decimal.NewFromInt(100)},
	}

	return db.Clauses(clause.OnConflict{DoNothing: true}).Create(&conversions).Error
}
