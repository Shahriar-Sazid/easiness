package middleware

import (
	"errors"
	"net/http"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

// ServiceError converts a service-layer error into an appropriate HTTP response.
func ServiceError(c echo.Context, err error) error {
	var appErr *dto.AppError
	if errors.As(err, &appErr) {
		return c.JSON(http.StatusUnprocessableEntity, appErr)
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return echo.NewHTTPError(http.StatusNotFound, "record not found")
	}
	return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
}

// OK writes a 200 JSON response.
func OK(c echo.Context, data any) error {
	return c.JSON(http.StatusOK, data)
}
