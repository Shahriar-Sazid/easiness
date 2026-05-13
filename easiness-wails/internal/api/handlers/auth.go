package handlers

import (
	"net/http"
	"time"

	"github.com/easiness/easiness-wails/internal/api/middleware"
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/service"
	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	svc       *service.AuthService
	jwtSecret string
}

func NewAuthHandler(svc *service.AuthService, jwtSecret string) *AuthHandler {
	return &AuthHandler{svc: svc, jwtSecret: jwtSecret}
}

func (h *AuthHandler) IsSetupRequired(c echo.Context) error {
	ok, err := h.svc.IsSetupRequired()
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	return middleware.OK(c, map[string]bool{"required": ok})
}

func (h *AuthHandler) Setup(c echo.Context) error {
	var req dto.SetupAuthRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := h.svc.Setup(req); err != nil {
		return middleware.ServiceError(c, err)
	}
	return c.NoContent(http.StatusNoContent)
}

func (h *AuthHandler) Login(c echo.Context) error {
	var req dto.LoginRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	resp, err := h.svc.Login(req)
	if err != nil {
		return middleware.ServiceError(c, err)
	}
	if !resp.Success {
		return echo.NewHTTPError(http.StatusUnauthorized, resp.Message)
	}

	token, err := middleware.IssueToken(h.jwtSecret, 15*time.Minute)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "could not issue token")
	}
	return middleware.OK(c, map[string]string{"token": token})
}

func (h *AuthHandler) ChangePassword(c echo.Context) error {
	var req dto.ChangePasswordRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := h.svc.ChangePassword(req); err != nil {
		return middleware.ServiceError(c, err)
	}
	return c.NoContent(http.StatusNoContent)
}
