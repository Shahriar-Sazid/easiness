package service

import (
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type BusinessService struct {
	db       *gorm.DB
	stockSvc *StockService
}

func NewBusinessService(db *gorm.DB) *BusinessService {
	return &BusinessService{db: db, stockSvc: NewStockService(db)}
}

// SavePurchaseOrder creates a PURCHASE_ORDER document, updates stock (add) and account balances.
func (s *BusinessService) SavePurchaseOrder(req dto.SaveDocumentRequest) (*dto.DocumentResponse, error) {
	var result *dto.DocumentResponse

	err := s.db.Transaction(func(tx *gorm.DB) error {
		total := decimal.Zero

		items := make([]models.DocumentItem, len(req.Items))
		for i, item := range req.Items {
			items[i] = models.DocumentItem{
				ProductID: item.ProductID,
				Quantity:  item.Quantity,
				Cost:      item.Cost,
				UnitID:    item.UnitID,
				PlaceID:   item.PlaceID,
			}
			total = total.Add(item.Cost.Mul(item.Quantity))
		}

		doc := models.Document{
			PeopleID: req.PeopleID,
			Type:     models.DocumentTypePurchaseOrder,
			Total:    total,
			Items:    items,
		}
		if err := tx.Create(&doc).Error; err != nil {
			return err
		}

		// Update stock for each item.
		for _, item := range doc.Items {
			if err := s.stockSvc.UpsertFromPurchase(tx, item); err != nil {
				return err
			}
		}

		// Update account balances and create Tx records.
		if err := s.applyPayments(tx, doc.ID, req.PeopleID, req.Payments, models.TxTypeExpense); err != nil {
			return err
		}

		// Update supplier balance.
		if err := s.updatePeopleBalance(tx, req.PeopleID, total.Neg()); err != nil {
			return err
		}

		r := toDocumentResponse(&doc)
		result = &r
		return nil
	})

	return result, err
}

// SaveInvoice creates an INVOICE document, deducts stock and updates account balances.
func (s *BusinessService) SaveInvoice(req dto.SaveDocumentRequest) (*dto.DocumentResponse, error) {
	var result *dto.DocumentResponse

	err := s.db.Transaction(func(tx *gorm.DB) error {
		total := decimal.Zero
		profit := decimal.Zero

		items := make([]models.DocumentItem, len(req.Items))
		for i, item := range req.Items {
			items[i] = models.DocumentItem{
				ProductID: item.ProductID,
				Quantity:  item.Quantity,
				Cost:      item.Cost,
				Price:     item.Price,
				UnitID:    item.UnitID,
				PlaceID:   item.PlaceID,
			}

			// Deduct stock and capture cost for profit calculation.
			stock, err := s.stockSvc.DeductForSale(tx, items[i])
			if err != nil {
				return err
			}
			items[i].AffectedStockID = stock.ID

			lineTotal := item.Price.Mul(item.Quantity)
			lineCost := stock.Cost.Mul(item.Quantity)
			total = total.Add(lineTotal)
			profit = profit.Add(lineTotal.Sub(lineCost))
		}

		doc := models.Document{
			PeopleID: req.PeopleID,
			Type:     models.DocumentTypeInvoice,
			Total:    total,
			Profit:   profit,
			Items:    items,
		}
		if err := tx.Create(&doc).Error; err != nil {
			return err
		}

		if err := s.applyPayments(tx, doc.ID, req.PeopleID, req.Payments, models.TxTypeIncome); err != nil {
			return err
		}

		// Update customer balance (positive = receivable).
		if err := s.updatePeopleBalance(tx, req.PeopleID, total); err != nil {
			return err
		}

		r := toDocumentResponse(&doc)
		result = &r
		return nil
	})

	return result, err
}

func (s *BusinessService) applyPayments(
	tx *gorm.DB,
	docID uint,
	peopleID uint,
	payments []dto.PaymentInput,
	txType models.TxType,
) error {
	for _, p := range payments {
		record := models.Tx{
			Amount:        p.Amount,
			DocumentID:    docID,
			PeopleID:      peopleID,
			FromAccountID: p.FromAccountID,
			ToAccountID:   p.ToAccountID,
			Type:          txType,
		}
		if err := tx.Create(&record).Error; err != nil {
			return err
		}

		// Deduct from source account.
		if p.FromAccountID != 0 {
			if err := tx.Model(&models.Account{}).
				Where("id = ?", p.FromAccountID).
				UpdateColumn("balance", gorm.Expr("CAST(balance AS NUMERIC) - ?", p.Amount.String())).Error; err != nil {
				return err
			}
		}
		// Add to destination account.
		if p.ToAccountID != 0 {
			if err := tx.Model(&models.Account{}).
				Where("id = ?", p.ToAccountID).
				UpdateColumn("balance", gorm.Expr("CAST(balance AS NUMERIC) + ?", p.Amount.String())).Error; err != nil {
				return err
			}
		}
	}
	return nil
}

func (s *BusinessService) updatePeopleBalance(tx *gorm.DB, peopleID uint, delta decimal.Decimal) error {
	return tx.Model(&models.People{}).
		Where("id = ?", peopleID).
		UpdateColumn("balance", gorm.Expr("CAST(balance AS NUMERIC) + ?", delta.String())).Error
}
