package handlers

import (
	"net/http"

	"github.com/easiness/easiness-wails/internal/api/middleware"
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/service"
	"github.com/labstack/echo/v4"
)

type AccountHandler struct{ svc *service.AccountService }

func NewAccountHandler(svc *service.AccountService) *AccountHandler {
	return &AccountHandler{svc: svc}
}

func (h *AccountHandler) Create(c echo.Context) error {
	var req dto.SaveAccountRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Save(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *AccountHandler) Update(c echo.Context) error {
	var req dto.SaveAccountRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Save(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *AccountHandler) Search(c echo.Context) error {
	var req dto.AccountSearchRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Search(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *AccountHandler) GetAll(c echo.Context) error {
	result, err := h.svc.GetAll()
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}
