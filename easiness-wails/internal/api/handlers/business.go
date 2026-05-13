package handlers

import (
	"net/http"
	"strconv"

	"github.com/easiness/easiness-wails/internal/api/middleware"
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/service"
	"github.com/labstack/echo/v4"
)

type BusinessHandler struct {
	bizSvc *service.BusinessService
	docSvc *service.DocumentService
	txSvc  *service.TxService
	stkSvc *service.StockService
	unitSvc *service.UnitService
	plcSvc *service.PlaceService
	dshSvc *service.DashboardService
}

func NewBusinessHandler(
	biz *service.BusinessService,
	doc *service.DocumentService,
	tx *service.TxService,
	stk *service.StockService,
	unit *service.UnitService,
	place *service.PlaceService,
	dash *service.DashboardService,
) *BusinessHandler {
	return &BusinessHandler{bizSvc: biz, docSvc: doc, txSvc: tx, stkSvc: stk, unitSvc: unit, plcSvc: place, dshSvc: dash}
}

// ── Business operations ───────────────────────────────────────────────────────

func (h *BusinessHandler) SavePurchaseOrder(c echo.Context) error {
	var req dto.SaveDocumentRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.bizSvc.SavePurchaseOrder(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *BusinessHandler) SaveInvoice(c echo.Context) error {
	var req dto.SaveDocumentRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.bizSvc.SaveInvoice(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

// ── Documents ─────────────────────────────────────────────────────────────────

func (h *BusinessHandler) SearchDocuments(c echo.Context) error {
	var req dto.DocumentSearchRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.docSvc.Search(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *BusinessHandler) GetDocumentDetails(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid id")
	}
	result, err := h.docSvc.GetDetails(uint(id))
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

// ── Transactions ──────────────────────────────────────────────────────────────

func (h *BusinessHandler) SearchTransactions(c echo.Context) error {
	var req dto.TxSearchRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.txSvc.Search(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

// ── Stock ─────────────────────────────────────────────────────────────────────

func (h *BusinessHandler) GetStock(c echo.Context) error {
	var req dto.StockSearchRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.stkSvc.Find(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *BusinessHandler) AddInitialStock(c echo.Context) error {
	var req dto.InitialStockRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := h.stkSvc.AddInitialStock(req); err != nil {
		return middleware.ServiceError(c, err)
	}
	return c.NoContent(http.StatusNoContent)
}

// ── Units & Places ────────────────────────────────────────────────────────────

func (h *BusinessHandler) GetUnitData(c echo.Context) error {
	result, err := h.unitSvc.GetAll()
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *BusinessHandler) CreatePlace(c echo.Context) error {
	var req dto.SavePlaceRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.plcSvc.Save(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *BusinessHandler) UpdatePlace(c echo.Context) error {
	return h.CreatePlace(c) // Save handles both
}

func (h *BusinessHandler) GetAllPlaces(c echo.Context) error {
	result, err := h.plcSvc.GetAll()
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

func (h *BusinessHandler) GetDashboard(c echo.Context) error {
	var req dto.DashboardRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.dshSvc.GetDashboard(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}
