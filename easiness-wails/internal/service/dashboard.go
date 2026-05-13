package service

import (
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type DashboardService struct{ db *gorm.DB }

func NewDashboardService(db *gorm.DB) *DashboardService { return &DashboardService{db: db} }

func (s *DashboardService) GetDashboard(req dto.DashboardRequest) (*dto.DashboardResponse, error) {
	resp := &dto.DashboardResponse{}

	// Account balance total.
	var balanceResult struct{ Total string }
	s.db.Model(&models.Account{}).Select("SUM(CAST(balance AS NUMERIC)) as total").Scan(&balanceResult)
	if balanceResult.Total != "" {
		resp.TotalAccountBalance, _ = decimal.NewFromString(balanceResult.Total)
	}

	// Receivable: sum of positive customer balances.
	var receivable struct{ Total string }
	s.db.Model(&models.People{}).
		Where("type IN (?) AND CAST(balance AS NUMERIC) > 0", []string{"CUSTOMER", "BOTH"}).
		Select("SUM(CAST(balance AS NUMERIC)) as total").Scan(&receivable)
	if receivable.Total != "" {
		resp.TotalReceivable, _ = decimal.NewFromString(receivable.Total)
	}

	// Payable: sum of negative supplier balances (stored as negative).
	var payable struct{ Total string }
	s.db.Model(&models.People{}).
		Where("type IN (?) AND CAST(balance AS NUMERIC) < 0", []string{"SUPPLIER", "BOTH"}).
		Select("SUM(ABS(CAST(balance AS NUMERIC))) as total").Scan(&payable)
	if payable.Total != "" {
		resp.TotalPayable, _ = decimal.NewFromString(payable.Total)
	}

	// Top products by profit (from invoices in date range).
	type productProfit struct {
		Name   string
		Profit string
	}
	var topByProfit []productProfit
	q := s.db.Model(&models.DocumentItem{}).
		Select("products.name as name, SUM((CAST(document_items.price AS NUMERIC) - CAST(document_items.cost AS NUMERIC)) * CAST(document_items.quantity AS NUMERIC)) as profit").
		Joins("JOIN documents ON documents.id = document_items.document_id").
		Joins("JOIN products ON products.id = document_items.product_id").
		Where("documents.type = ?", models.DocumentTypeInvoice).
		Group("document_items.product_id").
		Order("profit DESC").
		Limit(5)
	if !req.DateFrom.IsZero() {
		q = q.Where("documents.created_at >= ?", req.DateFrom)
	}
	if !req.DateTo.IsZero() {
		q = q.Where("documents.created_at <= ?", req.DateTo)
	}
	q.Scan(&topByProfit)

	resp.TopProductsByProfit = make([]dto.ChartPoint, len(topByProfit))
	for i, r := range topByProfit {
		val, _ := decimal.NewFromString(r.Profit)
		resp.TopProductsByProfit[i] = dto.ChartPoint{Label: r.Name, Value: val}
	}

	// Top products by quantity sold.
	type productQty struct {
		Name     string
		Quantity string
	}
	var topByQty []productQty
	s.db.Model(&models.DocumentItem{}).
		Select("products.name as name, SUM(CAST(document_items.quantity AS NUMERIC)) as quantity").
		Joins("JOIN documents ON documents.id = document_items.document_id").
		Joins("JOIN products ON products.id = document_items.product_id").
		Where("documents.type = ?", models.DocumentTypeInvoice).
		Group("document_items.product_id").
		Order("quantity DESC").
		Limit(5).
		Scan(&topByQty)

	resp.TopProductsByQuantity = make([]dto.ChartPoint, len(topByQty))
	for i, r := range topByQty {
		val, _ := decimal.NewFromString(r.Quantity)
		resp.TopProductsByQuantity[i] = dto.ChartPoint{Label: r.Name, Value: val}
	}

	// Recent transactions.
	var recentTxs []models.Tx
	s.db.Preload("FromAccount").Preload("ToAccount").Preload("People").
		Order("created_at DESC").Limit(10).Find(&recentTxs)
	resp.RecentTransactions = make([]dto.TxResponse, len(recentTxs))
	for i, t := range recentTxs {
		resp.RecentTransactions[i] = *toTxResponse(&t)
	}

	return resp, nil
}
