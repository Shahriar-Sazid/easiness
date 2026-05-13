package service

import (
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

type DocumentService struct{ db *gorm.DB }

func NewDocumentService(db *gorm.DB) *DocumentService { return &DocumentService{db: db} }

func (s *DocumentService) Search(req dto.DocumentSearchRequest) (*dto.Page[dto.DocumentResponse], error) {
	var records []models.Document
	var total int64

	q := s.db.Model(&models.Document{}).Preload("People")
	if req.Type != "" {
		q = q.Where("type = ?", req.Type)
	}
	if req.PeopleID != 0 {
		q = q.Where("people_id = ?", req.PeopleID)
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

	responses := make([]dto.DocumentResponse, len(records))
	for i, r := range records {
		responses[i] = toDocumentResponse(&r)
	}
	return dto.NewPage(responses, total, req.SearchRequest), nil
}

func (s *DocumentService) GetDetails(id uint) (*dto.DocumentDetailsResponse, error) {
	var doc models.Document
	if err := s.db.
		Preload("People").
		Preload("Items.Product").
		Preload("Items.Unit").
		Preload("Items.Place").
		Preload("Payments.FromAccount").
		Preload("Payments.ToAccount").
		First(&doc, id).Error; err != nil {
		return nil, dto.NewError(dto.ErrEntityNotFound, "document not found")
	}

	items := make([]dto.DocumentItemResponse, len(doc.Items))
	for i, item := range doc.Items {
		items[i] = toDocumentItemResponse(&item)
	}

	payments := make([]dto.TxResponse, len(doc.Payments))
	for i, p := range doc.Payments {
		payments[i] = *toTxResponse(&p)
	}

	base := toDocumentResponse(&doc)
	return &dto.DocumentDetailsResponse{
		DocumentResponse: base,
		Items:            items,
		Payments:         payments,
	}, nil
}

func toDocumentResponse(d *models.Document) dto.DocumentResponse {
	r := dto.DocumentResponse{
		ID:        d.ID,
		PeopleID:  d.PeopleID,
		Type:      string(d.Type),
		Total:     d.Total,
		Profit:    d.Profit,
		CreatedAt: d.CreatedAt,
	}
	if d.People.ID != 0 {
		r.People = toPeopleResponse(&d.People)
	}
	return r
}

func toDocumentItemResponse(item *models.DocumentItem) dto.DocumentItemResponse {
	r := dto.DocumentItemResponse{
		ID:        item.ID,
		ProductID: item.ProductID,
		Quantity:  item.Quantity,
		Cost:      item.Cost,
		Price:     item.Price,
		UnitID:    item.UnitID,
		PlaceID:   item.PlaceID,
	}
	if item.Product.ID != 0 {
		r.Product = toProductResponse(&item.Product)
	}
	return r
}
