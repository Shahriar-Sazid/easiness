package service_test

import (
	"testing"

	"github.com/easiness/easiness-wails/internal/db"
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"github.com/easiness/easiness-wails/internal/service"
	"github.com/shopspring/decimal"
)

func TestProductCreate(t *testing.T) {
	svc := service.NewProductService(newTestDB(t))

	resp, err := svc.Create(dto.SaveProductRequest{
		Name:          "Cotton T-Shirt",
		Type:          "Clothing",
		Brand:         "Generic",
		Country:       "Bangladesh",
		Size:          "M",
		PreferredUnit: 1,
	})
	if err != nil {
		t.Fatalf("create failed: %v", err)
	}
	if resp.ID == 0 {
		t.Error("expected non-zero ID")
	}
}

func TestProductCreate_Duplicate(t *testing.T) {
	svc := service.NewProductService(newTestDB(t))

	req := dto.SaveProductRequest{Name: "Item", Type: "T", Brand: "B", Country: "BD", Size: "L", PreferredUnit: 1}
	svc.Create(req)

	if _, err := svc.Create(req); err == nil {
		t.Error("expected duplicate error")
	}
}

func TestProductMove(t *testing.T) {
	database := newTestDB(t)
	svc := service.NewProductService(database)
	db.Seed(database)

	// Create product and places.
	prod, _ := svc.Create(dto.SaveProductRequest{Name: "Widget", Country: "BD", PreferredUnit: 1})
	database.Create(&models.Place{Name: "Warehouse A", Address: "Addr A"})
	database.Create(&models.Place{Name: "Warehouse B", Address: "Addr B"})

	// Add initial stock in place 1.
	database.Create(&models.Stock{
		ProductID: prod.ID,
		PlaceID:   1,
		UnitID:    1,
		Cost:      decimal.NewFromInt(10),
		Quantity:  decimal.NewFromInt(100),
	})

	err := svc.Move(dto.MoveProductRequest{
		ProductID:   prod.ID,
		FromPlaceID: 1,
		ToPlaceID:   2,
		Quantity:    "30",
		UnitID:      1,
	})
	if err != nil {
		t.Fatalf("move failed: %v", err)
	}

	var fromStock models.Stock
	database.Where("product_id = ? AND place_id = ?", prod.ID, 1).First(&fromStock)
	if fromStock.Quantity.String() != "70" {
		t.Errorf("from stock: got %s, want 70", fromStock.Quantity.String())
	}

	var toStock models.Stock
	database.Where("product_id = ? AND place_id = ?", prod.ID, 2).First(&toStock)
	if toStock.Quantity.String() != "30" {
		t.Errorf("to stock: got %s, want 30", toStock.Quantity.String())
	}
}

func TestProductMove_InsufficientStock(t *testing.T) {
	database := newTestDB(t)
	svc := service.NewProductService(database)

	prod, _ := svc.Create(dto.SaveProductRequest{Name: "Scarce Item", Country: "BD", PreferredUnit: 1})
	database.Create(&models.Stock{
		ProductID: prod.ID,
		PlaceID:   1,
		UnitID:    1,
		Cost:      decimal.NewFromInt(5),
		Quantity:  decimal.NewFromInt(10),
	})

	err := svc.Move(dto.MoveProductRequest{
		ProductID: prod.ID, FromPlaceID: 1, ToPlaceID: 2, Quantity: "50", UnitID: 1,
	})
	if err == nil {
		t.Error("expected insufficient stock error")
	}
}
