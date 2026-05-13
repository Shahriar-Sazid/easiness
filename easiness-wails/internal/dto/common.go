package dto

import "fmt"

// Page is a generic paginated response.
type Page[T any] struct {
	Content       []T   `json:"content"`
	TotalElements int64 `json:"totalElements"`
	TotalPages    int   `json:"totalPages"`
	Size          int   `json:"size"`
	Number        int   `json:"number"`
}

// SearchRequest holds common pagination fields.
type SearchRequest struct {
	Page int `json:"page"`
	Size int `json:"size"`
}

func (r SearchRequest) Offset() int {
	if r.Page < 0 {
		r.Page = 0
	}
	return r.Page * r.pageSize()
}

func (r SearchRequest) pageSize() int {
	if r.Size <= 0 {
		return 20
	}
	return r.Size
}

func (r SearchRequest) Limit() int { return r.pageSize() }

// NewPage builds a Page[T] from a slice and total count.
func NewPage[T any](content []T, total int64, req SearchRequest) *Page[T] {
	size := req.Limit()
	pages := int(total) / size
	if int(total)%size != 0 {
		pages++
	}
	return &Page[T]{
		Content:       content,
		TotalElements: total,
		TotalPages:    pages,
		Size:          size,
		Number:        req.Page,
	}
}

// AppError is returned from all service methods and serialised to the frontend.
type AppError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func (e *AppError) Error() string {
	return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

func NewError(code, msg string) *AppError {
	return &AppError{Code: code, Message: msg}
}

// Common error codes (mirrors the original ReasonCode enum).
const (
	ErrEntityNotFound     = "ENTITY_NOT_FOUND"
	ErrDupAccountName     = "DUP_ACCOUNT_NAME"
	ErrDupPeopleName      = "DUP_PEOPLE_NAME"
	ErrDupProductName     = "DUP_PRODUCT_NAME"
	ErrDupPlaceName       = "DUP_PLACE_NAME"
	ErrInsufficientStock  = "INSUFFICIENT_STOCK"
	ErrInvalidCredentials = "INVALID_CREDENTIALS"
	ErrAuthNotSetup       = "AUTH_NOT_SETUP"
)
