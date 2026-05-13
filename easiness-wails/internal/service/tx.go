package service

import (
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

type TxService struct{ db *gorm.DB }

func NewTxService(db *gorm.DB) *TxService { return &TxService{db: db} }

func (s *TxService) Search(req dto.TxSearchRequest) (*dto.Page[dto.TxResponse], error) {
	var records []models.Tx
	var total int64

	q := s.db.Model(&models.Tx{}).
		Preload("FromAccount").
		Preload("ToAccount").
		Preload("People")

	if req.Type != "" {
		q = q.Where("type = ?", req.Type)
	}
	if req.PeopleID != 0 {
		q = q.Where("people_id = ?", req.PeopleID)
	}
	if req.AccountID != 0 {
		q = q.Where("from_account_id = ? OR to_account_id = ?", req.AccountID, req.AccountID)
	}
	if req.DocumentID != 0 {
		q = q.Where("document_id = ?", req.DocumentID)
	}
	if !req.DateFrom.IsZero() {
		q = q.Where("created_at >= ?", req.DateFrom)
	}
	if !req.DateTo.IsZero() {
		q = q.Where("created_at <= ?", req.DateTo)
	}

	q.Count(&total)
	if err := q.Order("created_at DESC").Offset(req.Offset()).Limit(req.Limit()).Find(&records).Error; err != nil {
		return nil, err
	}

	responses := make([]dto.TxResponse, len(records))
	for i, r := range records {
		responses[i] = *toTxResponse(&r)
	}
	return dto.NewPage(responses, total, req.SearchRequest), nil
}

func toTxResponse(t *models.Tx) *dto.TxResponse {
	r := &dto.TxResponse{
		ID:            t.ID,
		Amount:        t.Amount,
		FromAccountID: t.FromAccountID,
		ToAccountID:   t.ToAccountID,
		DocumentID:    t.DocumentID,
		PeopleID:      t.PeopleID,
		Ref:           t.Ref,
		Type:          string(t.Type),
		Description:   t.Description,
		CreatedAt:     t.CreatedAt,
	}
	if t.FromAccount.ID != 0 {
		acc := toAccountResponse(&t.FromAccount)
		r.FromAccount = acc
	}
	if t.ToAccount.ID != 0 {
		acc := toAccountResponse(&t.ToAccount)
		r.ToAccount = acc
	}
	if t.People.ID != 0 {
		p := toPeopleResponse(&t.People)
		r.People = p
	}
	return r
}
