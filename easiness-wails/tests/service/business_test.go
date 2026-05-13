package service_test

import (
	"testing"

	"github.com/easiness/easiness-wails/internal/db"
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"github.com/easiness/easiness-wails/internal/service"
	"github.com/shopspring/decimal"
)

func TestSavePurchaseOrder(t *testing.T) {
	d := newTestDB(t)
	db.Seed(d)

	prodSvc := service.NewProductService(d)
	prod, _ := prodSvc.Create(dto.SaveProductRequest{Name: "Shirt", Country: "BD", PreferredUnit: 1})

	place := models.Place{Name: "Warehouse", Address: "Dhaka"}
	d.Create(&place)

	acc := models.Account{Type: "CASH", AccountName: "Cash", HolderName: "Owner", AccountNo: "C1", Balance: decimal.NewFromInt(5000)}
	d.Create(&acc)

	supplier := models.People{Name: "Supplier", CompanyName: "S Inc", Type: "SUPPLIER"}
	d.Create(&supplier)

	bizSvc := service.NewBusinessService(d)
	doc, err := bizSvc.SavePurchaseOrder(dto.SaveDocumentRequest{
		PeopleID: supplier.ID,
		Items: []dto.DocumentItemInput{{
			ProductID: prod.ID,
			Quantity:  decimal.NewFromInt(100),
			Cost:      decimal.NewFromFloat(50.5),
			UnitID:    1,
			PlaceID:   place.ID,
		}},
		Payments: []dto.PaymentInput{{
			Amount:        decimal.NewFromInt(5050),
			FromAccountID: acc.ID,
		}},
	})

	if err != nil {
		t.Fatalf("save PO failed: %v", err)
	}
	if doc.ID == 0 {
		t.Error("expected non-zero doc ID")
	}
	if doc.Total.String() != "5050" {
		t.Errorf("total: got %s, want 5050", doc.Total.String())
	}

	// Verify stock was created.
	var stock models.Stock
	d.Where("product_id = ? AND place_id = ?", prod.ID, place.ID).First(&stock)
	if stock.Quantity.String() != "100" {
		t.Errorf("stock quantity: got %s, want 100", stock.Quantity.String())
	}
}

func TestSaveInvoice_DeductsStock(t *testing.T) {
	d := newTestDB(t)
	db.Seed(d)

	prodSvc := service.NewProductService(d)
	prod, _ := prodSvc.Create(dto.SaveProductRequest{Name: "Pants", Country: "BD", PreferredUnit: 1})

	place := models.Place{Name: "Shop", Address: "Dhaka"}
	d.Create(&place)

	// Pre-populate stock.
	d.Create(&models.Stock{
		ProductID: prod.ID,
		PlaceID:   place.ID,
		UnitID:    1,
		Cost:      decimal.NewFromFloat(40),
		Quantity:  decimal.NewFromInt(50),
	})

	customer := models.People{Name: "Buyer", CompanyName: "B Corp", Type: "CUSTOMER"}
	d.Create(&customer)

	acc := models.Account{Type: "CASH", AccountName: "Till", HolderName: "Owner", AccountNo: "T1", Balance: decimal.Zero}
	d.Create(&acc)

	bizSvc := service.NewBusinessService(d)
	doc, err := bizSvc.SaveInvoice(dto.SaveDocumentRequest{
		PeopleID: customer.ID,
		Items: []dto.DocumentItemInput{{
			ProductID: prod.ID,
			Quantity:  decimal.NewFromInt(10),
			Cost:      decimal.NewFromFloat(40),
			Price:     decimal.NewFromFloat(60),
			UnitID:    1,
			PlaceID:   place.ID,
		}},
		Payments: []dto.PaymentInput{{
			Amount:      decimal.NewFromInt(600),
			ToAccountID: acc.ID,
		}},
	})

	if err != nil {
		t.Fatalf("save invoice failed: %v", err)
	}
	if doc.Total.String() != "600" {
		t.Errorf("total: got %s, want 600", doc.Total.String())
	}
	if doc.Profit.String() != "200" {
		t.Errorf("profit: got %s, want 200", doc.Profit.String())
	}

	var stock models.Stock
	d.Where("product_id = ? AND place_id = ?", prod.ID, place.ID).First(&stock)
	if stock.Quantity.String() != "40" {
		t.Errorf("remaining stock: got %s, want 40", stock.Quantity.String())
	}
}

func TestSaveInvoice_InsufficientStock(t *testing.T) {
	d := newTestDB(t)
	db.Seed(d)

	prodSvc := service.NewProductService(d)
	prod, _ := prodSvc.Create(dto.SaveProductRequest{Name: "LimitedItem", Country: "BD", PreferredUnit: 1})

	place := models.Place{Name: "Godown", Address: "Dhaka"}
	d.Create(&place)

	d.Create(&models.Stock{ProductID: prod.ID, PlaceID: place.ID, UnitID: 1,
		Cost: decimal.NewFromInt(10), Quantity: decimal.NewFromInt(5)})

	customer := models.People{Name: "Buyer2", CompanyName: "B2", Type: "CUSTOMER"}
	d.Create(&customer)

	bizSvc := service.NewBusinessService(d)
	_, err := bizSvc.SaveInvoice(dto.SaveDocumentRequest{
		PeopleID: customer.ID,
		Items: []dto.DocumentItemInput{{
			ProductID: prod.ID, Quantity: decimal.NewFromInt(10),
			Cost: decimal.NewFromInt(10), Price: decimal.NewFromInt(15),
			UnitID: 1, PlaceID: place.ID,
		}},
	})

	if err == nil {
		t.Error("expected insufficient stock error")
	}
}
