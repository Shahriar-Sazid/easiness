package handlers

import (
	"net/http"
	"strconv"

	"github.com/easiness/easiness-wails/internal/api/middleware"
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/service"
	"github.com/labstack/echo/v4"
)

type PeopleHandler struct{ svc *service.PeopleService }

func NewPeopleHandler(svc *service.PeopleService) *PeopleHandler {
	return &PeopleHandler{svc: svc}
}

func (h *PeopleHandler) Create(c echo.Context) error {
	var req dto.SavePeopleRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Save(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *PeopleHandler) Update(c echo.Context) error {
	var req dto.SavePeopleRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Save(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *PeopleHandler) Search(c echo.Context) error {
	var req dto.PeopleSearchRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Search(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *PeopleHandler) GetAll(c echo.Context) error {
	result, err := h.svc.GetAll()
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *PeopleHandler) GetCustomers(c echo.Context) error {
	result, err := h.svc.GetByType("CUSTOMER")
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *PeopleHandler) GetSuppliers(c echo.Context) error {
	result, err := h.svc.GetByType("SUPPLIER")
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *PeopleHandler) GetDetails(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid id")
	}
	result, err := h.svc.GetDetails(uint(id))
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}
