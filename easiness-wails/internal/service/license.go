package service

import (
	"errors"
	"strings"
	"time"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/license"
	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

type LicenseService struct{ db *gorm.DB }

func NewLicenseService(db *gorm.DB) *LicenseService { return &LicenseService{db: db} }

// GetStatus returns the current license status without re-validating the
// cryptographic signature (we trust what was validated at activation time).
func (s *LicenseService) GetStatus() (*dto.LicenseStatusResponse, error) {
	var stored models.StoredLicense
	err := s.db.First(&stored).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return &dto.LicenseStatusResponse{Status: string(license.StatusNone)}, nil
	}
	if err != nil {
		return nil, err
	}

	days := license.DaysRemaining(stored.ExpiresAt)
	status := license.StatusValid
	if time.Now().After(stored.ExpiresAt) {
		status = license.StatusExpired
	}

	return &dto.LicenseStatusResponse{
		Status:        string(status),
		Type:          stored.Type,
		Seats:         stored.Seats,
		ExpiresAt:     stored.ExpiresAt,
		DaysRemaining: days,
		Key:           maskKey(stored.Key),
	}, nil
}

// Activate validates a new license key and stores it, replacing any existing license.
func (s *LicenseService) Activate(req dto.ActivateLicenseRequest) (*dto.LicenseStatusResponse, error) {
	key := strings.TrimSpace(req.Key)

	parsed, err := license.Parse(key)
	if err != nil {
		switch {
		case errors.Is(err, license.ErrInvalidKey):
			return nil, dto.NewError("INVALID_LICENSE_KEY", "the license key format is invalid")
		case errors.Is(err, license.ErrBadSignature):
			return nil, dto.NewError("INVALID_LICENSE_KEY", "the license key signature is not valid")
		default:
			return nil, err
		}
	}

	expired := time.Now().After(parsed.ExpiresAt)

	// Delete any existing license before storing the new one.
	s.db.Where("1 = 1").Delete(&models.StoredLicense{})

	stored := models.StoredLicense{
		Key:         key,
		Type:        parsed.Type,
		Seats:       parsed.Seats,
		ExpiresAt:   parsed.ExpiresAt,
		ActivatedAt: time.Now(),
	}
	if err := s.db.Create(&stored).Error; err != nil {
		return nil, err
	}

	status := license.StatusValid
	if expired {
		status = license.StatusExpired
	}

	return &dto.LicenseStatusResponse{
		Status:        string(status),
		Type:          stored.Type,
		Seats:         stored.Seats,
		ExpiresAt:     stored.ExpiresAt,
		DaysRemaining: license.DaysRemaining(stored.ExpiresAt),
		Key:           maskKey(key),
	}, nil
}

// maskKey shows only the last 8 characters of the key for display.
// Example: "EASINESS-*****.xxxxx"
func maskKey(key string) string {
	if len(key) <= 12 {
		return key
	}
	visible := key[len(key)-8:]
	return "EASINESS-****." + visible
}
