package service

import (
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

type StockService struct{ db *gorm.DB }

func NewStockService(db *gorm.DB) *StockService { return &StockService{db: db} }

func (s *StockService) Find(req dto.StockSearchRequest) (*dto.Page[dto.StockResponse], error) {
	var records []models.Stock
	var total int64

	q := s.db.Model(&models.Stock{}).
		Preload("Product").
		Preload("Unit").
		Preload("Place")

	if req.ProductID != 0 {
		q = q.Where("product_id = ?", req.ProductID)
	}
	if req.PlaceID != 0 {
		q = q.Where("place_id = ?", req.PlaceID)
	}

	q.Count(&total)
	if err := q.Offset(req.Offset()).Limit(req.Limit()).Find(&records).Error; err != nil {
		return nil, err
	}

	responses := make([]dto.StockResponse, len(records))
	for i, r := range records {
		responses[i] = toStockResponse(&r)
	}
	return dto.NewPage(responses, total, req.SearchRequest), nil
}

func (s *StockService) AddInitialStock(req dto.InitialStockRequest) error {
	stock := models.Stock{
		ProductID: req.ProductID,
		PlaceID:   req.PlaceID,
		UnitID:    req.UnitID,
		Quantity:  req.Quantity,
		Cost:      req.Cost,
	}
	return s.db.Save(&stock).Error
}

// UpsertFromPurchase adds stock when a purchase order is saved.
func (s *StockService) UpsertFromPurchase(tx *gorm.DB, item models.DocumentItem) error {
	var stock models.Stock
	result := tx.Where("product_id = ? AND place_id = ?", item.ProductID, item.PlaceID).First(&stock)
	if result.Error != nil {
		stock = models.Stock{
			ProductID: item.ProductID,
			PlaceID:   item.PlaceID,
			UnitID:    item.UnitID,
			Cost:      item.Cost,
			Quantity:  item.Quantity,
		}
		return tx.Create(&stock).Error
	}

	// Weighted average cost.
	totalQty := stock.Quantity.Add(item.Quantity)
	if totalQty.IsPositive() {
		stock.Cost = stock.Cost.Mul(stock.Quantity).Add(item.Cost.Mul(item.Quantity)).Div(totalQty)
	}
	stock.Quantity = totalQty
	return tx.Save(&stock).Error
}

// DeductForSale removes stock when an invoice is saved.
func (s *StockService) DeductForSale(tx *gorm.DB, item models.DocumentItem) (*models.Stock, error) {
	var stock models.Stock
	if err := tx.Where("product_id = ? AND place_id = ?", item.ProductID, item.PlaceID).First(&stock).Error; err != nil {
		return nil, dto.NewError(dto.ErrEntityNotFound, "stock not found for product")
	}
	if stock.Quantity.LessThan(item.Quantity) {
		return nil, dto.NewError(dto.ErrInsufficientStock, "insufficient stock")
	}
	stock.Quantity = stock.Quantity.Sub(item.Quantity)
	stock.LatestPrice = item.Price
	if err := tx.Save(&stock).Error; err != nil {
		return nil, err
	}
	return &stock, nil
}

func toStockResponse(s *models.Stock) dto.StockResponse {
	r := dto.StockResponse{
		ID:          s.ID,
		ProductID:   s.ProductID,
		Cost:        s.Cost,
		LatestPrice: s.LatestPrice,
		Quantity:    s.Quantity,
		UnitID:      s.UnitID,
		PlaceID:     s.PlaceID,
	}
	if s.Product.ID != 0 {
		r.Product = toProductResponse(&s.Product)
	}
	if s.Unit.ID != 0 {
		r.Unit = &dto.UnitDTO{ID: s.Unit.ID, Name: s.Unit.Name}
	}
	if s.Place.ID != 0 {
		r.Place = &dto.PlaceResponse{ID: s.Place.ID, Name: s.Place.Name, Address: s.Place.Address}
	}
	return r
}
