package service

import (
	"strings"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type ProductService struct{ db *gorm.DB }

func NewProductService(db *gorm.DB) *ProductService { return &ProductService{db: db} }

func (s *ProductService) Create(req dto.SaveProductRequest) (*dto.ProductResponse, error) {
	if err := s.validateUnique(req); err != nil {
		return nil, err
	}
	p := models.Product{
		Name:          req.Name,
		Type:          req.Type,
		Brand:         req.Brand,
		Country:       req.Country,
		Size:          req.Size,
		PreferredUnit: req.PreferredUnit,
	}
	if err := s.db.Create(&p).Error; err != nil {
		return nil, err
	}
	return toProductResponse(&p), nil
}

func (s *ProductService) Update(req dto.SaveProductRequest) (*dto.ProductResponse, error) {
	if err := s.validateUnique(req); err != nil {
		return nil, err
	}
	var p models.Product
	if err := s.db.First(&p, req.ID).Error; err != nil {
		return nil, dto.NewError(dto.ErrEntityNotFound, "product not found")
	}
	p.Name = req.Name
	p.Type = req.Type
	p.Brand = req.Brand
	p.Country = req.Country
	p.Size = req.Size
	p.PreferredUnit = req.PreferredUnit
	if err := s.db.Save(&p).Error; err != nil {
		return nil, err
	}
	return toProductResponse(&p), nil
}

func (s *ProductService) Search(req dto.ProductSearchRequest) (*dto.Page[dto.ProductResponse], error) {
	var records []models.Product
	var total int64

	q := s.db.Model(&models.Product{}).
		Where("(:name = '' OR LOWER(name) LIKE '%' || :name || '%')", map[string]interface{}{"name": strings.ToLower(req.Name)}).
		Where("(:type = '' OR LOWER(type) LIKE '%' || :type || '%')", map[string]interface{}{"type": strings.ToLower(req.Type)}).
		Where("(:brand = '' OR LOWER(brand) LIKE '%' || :brand || '%')", map[string]interface{}{"brand": strings.ToLower(req.Brand)}).
		Where("(:country = '' OR LOWER(country) LIKE '%' || :country || '%')", map[string]interface{}{"country": strings.ToLower(req.Country)}).
		Where("(:size = '' OR LOWER(size) LIKE '%' || :size || '%')", map[string]interface{}{"size": strings.ToLower(req.Size)})

	q.Count(&total)
	if err := q.Offset(req.Offset()).Limit(req.Limit()).Find(&records).Error; err != nil {
		return nil, err
	}
	responses := make([]dto.ProductResponse, len(records))
	for i, r := range records {
		responses[i] = *toProductResponse(&r)
	}
	return dto.NewPage(responses, total, req.SearchRequest), nil
}

func (s *ProductService) Move(req dto.MoveProductRequest) error {
	qty, err := decimal.NewFromString(req.Quantity)
	if err != nil || qty.IsZero() {
		return dto.NewError("INVALID_QUANTITY", "invalid quantity")
	}

	return s.db.Transaction(func(tx *gorm.DB) error {
		var fromStock models.Stock
		if err := tx.Where("product_id = ? AND place_id = ?", req.ProductID, req.FromPlaceID).First(&fromStock).Error; err != nil {
			return dto.NewError(dto.ErrEntityNotFound, "source stock not found")
		}
		if fromStock.Quantity.LessThan(qty) {
			return dto.NewError(dto.ErrInsufficientStock, "insufficient stock")
		}

		// Deduct from source.
		fromStock.Quantity = fromStock.Quantity.Sub(qty)
		if err := tx.Save(&fromStock).Error; err != nil {
			return err
		}

		// Add to destination (upsert).
		var toStock models.Stock
		result := tx.Where("product_id = ? AND place_id = ?", req.ProductID, req.ToPlaceID).First(&toStock)
		if result.Error != nil {
			toStock = models.Stock{
				ProductID: req.ProductID,
				PlaceID:   req.ToPlaceID,
				UnitID:    fromStock.UnitID,
				Cost:      fromStock.Cost,
				Quantity:  qty,
			}
			return tx.Create(&toStock).Error
		}
		toStock.Quantity = toStock.Quantity.Add(qty)
		return tx.Save(&toStock).Error
	})
}

func (s *ProductService) validateUnique(req dto.SaveProductRequest) error {
	var existing []models.Product
	s.db.Where("name = ? AND type = ? AND brand = ? AND size = ?", req.Name, req.Type, req.Brand, req.Size).Find(&existing)
	for _, e := range existing {
		if req.ID != 0 && e.ID == req.ID {
			continue
		}
		return dto.NewError(dto.ErrDupProductName, "product already exists: "+req.Name)
	}
	return nil
}

func toProductResponse(p *models.Product) *dto.ProductResponse {
	return &dto.ProductResponse{
		ID:            p.ID,
		Name:          p.Name,
		Type:          p.Type,
		Brand:         p.Brand,
		Country:       p.Country,
		Size:          p.Size,
		PreferredUnit: p.PreferredUnit,
	}
}
