package dto

import "time"

type ActivateLicenseRequest struct {
	Key string `json:"key"`
}

// LicenseStatusResponse is returned to the frontend on every check.
type LicenseStatusResponse struct {
	Status       string    `json:"status"`        // "none", "valid", "expired"
	Type         string    `json:"type"`          // "standard", "professional", etc.
	Seats        int       `json:"seats"`
	ExpiresAt    time.Time `json:"expiresAt"`
	DaysRemaining int      `json:"daysRemaining"` // negative = already expired
	Key          string    `json:"key"`           // masked key for display
}
