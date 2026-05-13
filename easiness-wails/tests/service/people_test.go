package service_test

import (
	"testing"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/service"
)

func TestPeopleCreate(t *testing.T) {
	svc := service.NewPeopleService(newTestDB(t))

	resp, err := svc.Save(dto.SavePeopleRequest{
		Name:        "John Doe",
		CompanyName: "Acme Ltd",
		Type:        "CUSTOMER",
		ContactNoList: []dto.ContactNoInput{
			{No: "01700000001"},
		},
	})
	if err != nil {
		t.Fatalf("create failed: %v", err)
	}
	if len(resp.ContactNoList) != 1 {
		t.Errorf("expected 1 contact, got %d", len(resp.ContactNoList))
	}
}

func TestPeopleCreate_Duplicate(t *testing.T) {
	svc := service.NewPeopleService(newTestDB(t))

	req := dto.SavePeopleRequest{Name: "Jane", CompanyName: "Corp", Type: "SUPPLIER"}
	svc.Save(req)

	if _, err := svc.Save(req); err == nil {
		t.Error("expected duplicate error")
	}
}

func TestPeopleGetByType(t *testing.T) {
	svc := service.NewPeopleService(newTestDB(t))

	svc.Save(dto.SavePeopleRequest{Name: "Customer A", CompanyName: "CA", Type: "CUSTOMER"})
	svc.Save(dto.SavePeopleRequest{Name: "Supplier B", CompanyName: "SB", Type: "SUPPLIER"})
	svc.Save(dto.SavePeopleRequest{Name: "Both C", CompanyName: "BC", Type: "BOTH"})

	customers, _ := svc.GetByType("CUSTOMER")
	if len(customers) != 2 { // CUSTOMER + BOTH
		t.Errorf("got %d customers, want 2", len(customers))
	}

	suppliers, _ := svc.GetByType("SUPPLIER")
	if len(suppliers) != 2 { // SUPPLIER + BOTH
		t.Errorf("got %d suppliers, want 2", len(suppliers))
	}
}

func TestPeopleSearch(t *testing.T) {
	svc := service.NewPeopleService(newTestDB(t))

	svc.Save(dto.SavePeopleRequest{Name: "Alice", CompanyName: "Alice Co", Type: "CUSTOMER"})
	svc.Save(dto.SavePeopleRequest{Name: "Bob", CompanyName: "Bob LLC", Type: "SUPPLIER"})

	page, err := svc.Search(dto.PeopleSearchRequest{
		Name:          "ali",
		SearchRequest: dto.SearchRequest{Page: 0, Size: 10},
	})
	if err != nil {
		t.Fatalf("search failed: %v", err)
	}
	if page.TotalElements != 1 {
		t.Errorf("got %d, want 1", page.TotalElements)
	}
}
