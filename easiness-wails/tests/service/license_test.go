package service_test

import (
	"crypto/ed25519"
	"testing"
	"time"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/license"
	"github.com/easiness/easiness-wails/internal/service"
)

// makeKey generates a license key signed with the test private key.
func makeKey(t *testing.T, expiry string, licType string) string {
	t.Helper()
	key, err := license.Sign(
		license.Payload{Version: 1, Expiry: expiry, Type: licType, Seats: 1},
		ed25519.PrivateKey(license.TestPrivateKey),
	)
	if err != nil {
		t.Fatalf("makeKey: %v", err)
	}
	return key
}

func futureExpiry() string {
	return time.Now().AddDate(1, 0, 0).Format("2006-01-02")
}

func pastExpiry() string {
	return time.Now().AddDate(-1, 0, 0).Format("2006-01-02")
}

// ── GetStatus ────────────────────────────────────────────────────────────────

func TestLicenseGetStatus_None(t *testing.T) {
	svc := service.NewLicenseService(newTestDB(t))

	status, err := svc.GetStatus()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if status.Status != string(license.StatusNone) {
		t.Errorf("expected status %q, got %q", license.StatusNone, status.Status)
	}
}

func TestLicenseGetStatus_Valid(t *testing.T) {
	db := newTestDB(t)
	svc := service.NewLicenseService(db)

	key := makeKey(t, futureExpiry(), "standard")
	_, err := svc.Activate(dto.ActivateLicenseRequest{Key: key})
	if err != nil {
		t.Fatalf("activate: %v", err)
	}

	status, err := svc.GetStatus()
	if err != nil {
		t.Fatalf("get status: %v", err)
	}
	if status.Status != string(license.StatusValid) {
		t.Errorf("expected %q, got %q", license.StatusValid, status.Status)
	}
	if status.DaysRemaining <= 0 {
		t.Errorf("expected positive days remaining, got %d", status.DaysRemaining)
	}
}

func TestLicenseGetStatus_Expired(t *testing.T) {
	db := newTestDB(t)
	svc := service.NewLicenseService(db)

	key := makeKey(t, pastExpiry(), "standard")
	_, err := svc.Activate(dto.ActivateLicenseRequest{Key: key})
	if err != nil {
		t.Fatalf("activate: %v", err)
	}

	status, err := svc.GetStatus()
	if err != nil {
		t.Fatalf("get status: %v", err)
	}
	if status.Status != string(license.StatusExpired) {
		t.Errorf("expected %q, got %q", license.StatusExpired, status.Status)
	}
	if status.DaysRemaining >= 0 {
		t.Errorf("expected negative days remaining for expired license, got %d", status.DaysRemaining)
	}
}

// ── Activate ─────────────────────────────────────────────────────────────────

func TestLicenseActivate_ValidKey(t *testing.T) {
	svc := service.NewLicenseService(newTestDB(t))

	key := makeKey(t, futureExpiry(), "professional")
	resp, err := svc.Activate(dto.ActivateLicenseRequest{Key: key})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.Status != string(license.StatusValid) {
		t.Errorf("expected %q, got %q", license.StatusValid, resp.Status)
	}
	if resp.Type != "professional" {
		t.Errorf("expected type %q, got %q", "professional", resp.Type)
	}
	if resp.Key == key {
		t.Error("response key should be masked, not the raw key")
	}
}

func TestLicenseActivate_ExpiredKey(t *testing.T) {
	svc := service.NewLicenseService(newTestDB(t))

	key := makeKey(t, pastExpiry(), "standard")
	resp, err := svc.Activate(dto.ActivateLicenseRequest{Key: key})
	if err != nil {
		t.Fatalf("activation of expired key should not error; got: %v", err)
	}
	if resp.Status != string(license.StatusExpired) {
		t.Errorf("expected %q, got %q", license.StatusExpired, resp.Status)
	}
}

func TestLicenseActivate_InvalidFormat(t *testing.T) {
	svc := service.NewLicenseService(newTestDB(t))

	_, err := svc.Activate(dto.ActivateLicenseRequest{Key: "NOTAVALIDKEY"})
	if err == nil {
		t.Fatal("expected error for invalid key format")
	}
	appErr, ok := err.(*dto.AppError)
	if !ok {
		t.Fatalf("expected AppError, got %T: %v", err, err)
	}
	if appErr.Code != "INVALID_LICENSE_KEY" {
		t.Errorf("expected code INVALID_LICENSE_KEY, got %q", appErr.Code)
	}
}

func TestLicenseActivate_TamperedSignature(t *testing.T) {
	svc := service.NewLicenseService(newTestDB(t))

	good := makeKey(t, futureExpiry(), "standard")
	// Replace last character to corrupt the signature
	tampered := good[:len(good)-1] + "X"

	_, err := svc.Activate(dto.ActivateLicenseRequest{Key: tampered})
	if err == nil {
		t.Fatal("expected error for tampered key")
	}
	appErr, ok := err.(*dto.AppError)
	if !ok {
		t.Fatalf("expected AppError, got %T: %v", err, err)
	}
	if appErr.Code != "INVALID_LICENSE_KEY" {
		t.Errorf("expected code INVALID_LICENSE_KEY, got %q", appErr.Code)
	}
}

func TestLicenseActivate_ReplacesExistingLicense(t *testing.T) {
	db := newTestDB(t)
	svc := service.NewLicenseService(db)

	key1 := makeKey(t, futureExpiry(), "standard")
	_, err := svc.Activate(dto.ActivateLicenseRequest{Key: key1})
	if err != nil {
		t.Fatalf("first activation: %v", err)
	}

	key2 := makeKey(t, time.Now().AddDate(2, 0, 0).Format("2006-01-02"), "enterprise")
	resp, err := svc.Activate(dto.ActivateLicenseRequest{Key: key2})
	if err != nil {
		t.Fatalf("second activation: %v", err)
	}
	if resp.Type != "enterprise" {
		t.Errorf("expected type %q after replacement, got %q", "enterprise", resp.Type)
	}

	// GetStatus should reflect the new key
	status, _ := svc.GetStatus()
	if status.Type != "enterprise" {
		t.Errorf("GetStatus should return new type %q, got %q", "enterprise", status.Type)
	}
}

// ── maskKey (via response) ───────────────────────────────────────────────────

func TestLicenseActivate_KeyIsMasked(t *testing.T) {
	svc := service.NewLicenseService(newTestDB(t))

	key := makeKey(t, futureExpiry(), "standard")
	resp, err := svc.Activate(dto.ActivateLicenseRequest{Key: key})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(resp.Key) == len(key) {
		t.Error("response key length should be shorter than original (masked)")
	}
	// Masked key starts with "EASINESS-****."
	expected := "EASINESS-****."
	if len(resp.Key) < len(expected) || resp.Key[:len(expected)] != expected {
		t.Errorf("masked key should start with %q, got %q", expected, resp.Key)
	}
}
