package service

import (
	"strings"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

type AccountService struct{ db *gorm.DB }

func NewAccountService(db *gorm.DB) *AccountService { return &AccountService{db: db} }

func (s *AccountService) Save(req dto.SaveAccountRequest) (*dto.AccountResponse, error) {
	if err := s.validateUnique(req); err != nil {
		return nil, err
	}

	acc := models.Account{
		Type:        models.AccountType(req.Type),
		AccountName: req.AccountName,
		HolderName:  req.HolderName,
		Bank:        req.Bank,
		Branch:      req.Branch,
		AccountNo:   req.AccountNo,
		Balance:     req.Balance,
	}
	if req.ID != 0 {
		acc.ID = req.ID
	}

	if err := s.db.Save(&acc).Error; err != nil {
		return nil, err
	}
	return toAccountResponse(&acc), nil
}

func (s *AccountService) Search(req dto.AccountSearchRequest) (*dto.Page[dto.AccountResponse], error) {
	var records []models.Account
	var total int64

	q := s.db.Model(&models.Account{}).
		Where("(:no = '' OR LOWER(account_no) LIKE '%' || :no || '%')", map[string]interface{}{"no": strings.ToLower(req.AccountNo)}).
		Where("(:name = '' OR LOWER(account_name) LIKE '%' || :name || '%')", map[string]interface{}{"name": strings.ToLower(req.AccountName)}).
		Where("(:holder = '' OR LOWER(holder_name) LIKE '%' || :holder || '%')", map[string]interface{}{"holder": strings.ToLower(req.HolderName)})

	q.Count(&total)
	if err := q.Offset(req.Offset()).Limit(req.Limit()).Find(&records).Error; err != nil {
		return nil, err
	}

	responses := make([]dto.AccountResponse, len(records))
	for i, r := range records {
		responses[i] = *toAccountResponse(&r)
	}
	return dto.NewPage(responses, total, req.SearchRequest), nil
}

func (s *AccountService) GetAll() (map[uint]dto.AccountResponse, error) {
	var records []models.Account
	if err := s.db.Find(&records).Error; err != nil {
		return nil, err
	}
	result := make(map[uint]dto.AccountResponse, len(records))
	for _, r := range records {
		result[r.ID] = *toAccountResponse(&r)
	}
	return result, nil
}

func (s *AccountService) validateUnique(req dto.SaveAccountRequest) error {
	var existing []models.Account
	s.db.Where("account_name = ? OR account_no = ?", req.AccountName, req.AccountNo).Find(&existing)

	for _, e := range existing {
		if req.ID != 0 && e.ID == req.ID {
			continue
		}
		if e.AccountName == req.AccountName {
			return dto.NewError(dto.ErrDupAccountName, "account already exists with name: "+req.AccountName)
		}
		if e.AccountNo == req.AccountNo {
			return dto.NewError(dto.ErrDupAccountName, "account already exists with no: "+req.AccountNo)
		}
	}
	return nil
}

func toAccountResponse(a *models.Account) *dto.AccountResponse {
	return &dto.AccountResponse{
		ID:          a.ID,
		Type:        string(a.Type),
		AccountName: a.AccountName,
		HolderName:  a.HolderName,
		Bank:        a.Bank,
		Branch:      a.Branch,
		AccountNo:   a.AccountNo,
		Balance:     a.Balance,
	}
}
