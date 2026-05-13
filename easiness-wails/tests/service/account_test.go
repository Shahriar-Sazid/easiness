package service_test

import (
	"testing"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/service"
	"github.com/shopspring/decimal"
)

func TestAccountCreate(t *testing.T) {
	svc := service.NewAccountService(newTestDB(t))

	resp, err := svc.Save(dto.SaveAccountRequest{
		Type:        "CASH",
		AccountName: "Main Cash",
		HolderName:  "Owner",
		AccountNo:   "CASH-001",
		Balance:     decimal.NewFromInt(1000),
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.ID == 0 {
		t.Error("expected non-zero ID")
	}
	if resp.AccountName != "Main Cash" {
		t.Errorf("got name %q, want %q", resp.AccountName, "Main Cash")
	}
}

func TestAccountCreate_DuplicateName(t *testing.T) {
	svc := service.NewAccountService(newTestDB(t))

	req := dto.SaveAccountRequest{
		Type:        "CASH",
		AccountName: "Dup Account",
		HolderName:  "Owner",
		AccountNo:   "ACC-001",
	}
	if _, err := svc.Save(req); err != nil {
		t.Fatalf("first create failed: %v", err)
	}

	req.AccountNo = "ACC-002"
	if _, err := svc.Save(req); err == nil {
		t.Error("expected duplicate-name error, got nil")
	}
}

func TestAccountCreate_DuplicateAccountNo(t *testing.T) {
	svc := service.NewAccountService(newTestDB(t))

	req := dto.SaveAccountRequest{
		Type:        "BANK",
		AccountName: "Savings",
		HolderName:  "Owner",
		AccountNo:   "BANK-001",
	}
	if _, err := svc.Save(req); err != nil {
		t.Fatalf("first create failed: %v", err)
	}

	req.AccountName = "Other"
	if _, err := svc.Save(req); err == nil {
		t.Error("expected duplicate account-no error, got nil")
	}
}

func TestAccountUpdate(t *testing.T) {
	svc := service.NewAccountService(newTestDB(t))

	created, _ := svc.Save(dto.SaveAccountRequest{
		Type:        "BANK",
		AccountName: "Old Name",
		HolderName:  "John",
		AccountNo:   "BANK-XYZ",
	})

	updated, err := svc.Save(dto.SaveAccountRequest{
		ID:          created.ID,
		Type:        "BANK",
		AccountName: "New Name",
		HolderName:  "John",
		AccountNo:   "BANK-XYZ",
	})
	if err != nil {
		t.Fatalf("update failed: %v", err)
	}
	if updated.AccountName != "New Name" {
		t.Errorf("got %q, want %q", updated.AccountName, "New Name")
	}
}

func TestAccountSearch(t *testing.T) {
	svc := service.NewAccountService(newTestDB(t))

	for i, name := range []string{"Alpha Bank", "Beta Cash", "Gamma Bank"} {
		svc.Save(dto.SaveAccountRequest{
			Type:        "BANK",
			AccountName: name,
			HolderName:  "Owner",
			AccountNo:   "ACC" + string(rune('0'+i)),
		})
	}

	page, err := svc.Search(dto.AccountSearchRequest{
		AccountName:   "bank",
		SearchRequest: dto.SearchRequest{Page: 0, Size: 10},
	})
	if err != nil {
		t.Fatalf("search failed: %v", err)
	}
	if page.TotalElements != 2 {
		t.Errorf("got %d results, want 2", page.TotalElements)
	}
}

func TestAccountGetAll(t *testing.T) {
	svc := service.NewAccountService(newTestDB(t))

	svc.Save(dto.SaveAccountRequest{Type: "CASH", AccountName: "A", HolderName: "X", AccountNo: "1"})
	svc.Save(dto.SaveAccountRequest{Type: "CASH", AccountName: "B", HolderName: "X", AccountNo: "2"})

	all, err := svc.GetAll()
	if err != nil {
		t.Fatalf("GetAll failed: %v", err)
	}
	if len(all) != 2 {
		t.Errorf("got %d accounts, want 2", len(all))
	}
}
