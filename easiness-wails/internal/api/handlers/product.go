package handlers

import (
	"net/http"

	"github.com/easiness/easiness-wails/internal/api/middleware"
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/service"
	"github.com/labstack/echo/v4"
)

type ProductHandler struct{ svc *service.ProductService }

func NewProductHandler(svc *service.ProductService) *ProductHandler {
	return &ProductHandler{svc: svc}
}

func (h *ProductHandler) Create(c echo.Context) error {
	var req dto.SaveProductRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Create(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *ProductHandler) Update(c echo.Context) error {
	var req dto.SaveProductRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Update(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *ProductHandler) Search(c echo.Context) error {
	var req dto.ProductSearchRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Search(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *ProductHandler) Move(c echo.Context) error {
	var req dto.MoveProductRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := h.svc.Move(req); err != nil {
		return middleware.ServiceError(c, err)
	}
	return c.NoContent(http.StatusNoContent)
}
