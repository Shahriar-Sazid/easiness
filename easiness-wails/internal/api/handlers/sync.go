package handlers

import (
	"net/http"

	"github.com/easiness/easiness-wails/internal/api/middleware"
	internalsync "github.com/easiness/easiness-wails/internal/sync"
	"github.com/labstack/echo/v4"
)

type SyncHandler struct{ svc *internalsync.Service }

func NewSyncHandler(svc *internalsync.Service) *SyncHandler {
	return &SyncHandler{svc: svc}
}

func (h *SyncHandler) Register(c echo.Context) error {
	var req internalsync.RegisterDeviceRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.RegisterDevice(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *SyncHandler) Push(c echo.Context) error {
	var req internalsync.PushRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	result, err := h.svc.Push(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}

func (h *SyncHandler) Pull(c echo.Context) error {
	cursor := c.QueryParam("cursor")
	deviceID := c.QueryParam("device")
	if deviceID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "device query param required")
	}
	result, err := h.svc.Pull(cursor, deviceID)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, result)
}
