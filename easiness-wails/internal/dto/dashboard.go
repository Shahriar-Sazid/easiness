package dto

import (
	"time"

	"github.com/shopspring/decimal"
)

type DashboardRequest struct {
	DateFrom time.Time `json:"dateFrom"`
	DateTo   time.Time `json:"dateTo"`
}

type ChartPoint struct {
	Label string          `json:"label"`
	Value decimal.Decimal `json:"value"`
}

type DashboardResponse struct {
	TotalReceivable   decimal.Decimal `json:"totalReceivable"`
	TotalPayable      decimal.Decimal `json:"totalPayable"`
	TotalAccountBalance decimal.Decimal `json:"totalAccountBalance"`
	TopProductsByProfit  []ChartPoint  `json:"topProductsByProfit"`
	TopProductsByQuantity []ChartPoint `json:"topProductsByQuantity"`
	RecentTransactions   []TxResponse `json:"recentTransactions"`
}
