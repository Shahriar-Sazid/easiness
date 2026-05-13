// Package license implements offline Ed25519-based license key validation.
//
// Key format:
//
//	EASINESS-<base64url(JSON payload)>.<base64url(Ed25519 signature)>
//
// The JSON payload contains: version, expiry date, license type, seats.
// The signature is produced by the seller's private key (never in this binary).
// Verification uses the public key embedded at compile time (see keys.go).
package license

import (
	"crypto/ed25519"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"time"
)

const keyPrefix = "EASINESS-"

// Payload is the plaintext content embedded in every license key.
type Payload struct {
	Version int    `json:"v"`
	Expiry  string `json:"exp"`  // RFC 3339 date: "2027-05-13"
	Type    string `json:"type"` // "standard", "professional", "enterprise"
	Seats   int    `json:"seats"`
}

// ParsedLicense is the result of successfully parsing and verifying a key.
type ParsedLicense struct {
	Payload
	ExpiresAt time.Time
}

// Status describes the runtime state of the license.
type Status string

const (
	StatusNone    Status = "none"    // no license installed
	StatusValid   Status = "valid"   // valid and not expired
	StatusExpired Status = "expired" // signature OK but past expiry
	StatusInvalid Status = "invalid" // bad signature or malformed
)

var (
	ErrNoLicense      = errors.New("no license installed")
	ErrInvalidKey     = errors.New("invalid license key")
	ErrBadSignature   = errors.New("license signature verification failed")
	ErrLicenseExpired = errors.New("license has expired")
)

// Parse decodes and verifies a license key string.
// It returns the parsed payload on success, or an error.
func Parse(key string) (*ParsedLicense, error) {
	key = strings.TrimSpace(key)
	if !strings.HasPrefix(key, keyPrefix) {
		return nil, ErrInvalidKey
	}
	key = strings.TrimPrefix(key, keyPrefix)

	parts := strings.SplitN(key, ".", 2)
	if len(parts) != 2 {
		return nil, ErrInvalidKey
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		return nil, ErrInvalidKey
	}

	sigBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, ErrInvalidKey
	}

	pubKey := ed25519.PublicKey(EmbeddedPublicKey)
	if !ed25519.Verify(pubKey, payloadBytes, sigBytes) {
		return nil, ErrBadSignature
	}

	var p Payload
	if err := json.Unmarshal(payloadBytes, &p); err != nil {
		return nil, ErrInvalidKey
	}

	expiry, err := time.Parse("2006-01-02", p.Expiry)
	if err != nil {
		return nil, ErrInvalidKey
	}
	// Expiry is inclusive — the license is valid through the end of the expiry day.
	expiry = expiry.Add(24*time.Hour - time.Second)

	return &ParsedLicense{Payload: p, ExpiresAt: expiry}, nil
}

// Validate parses the key and additionally checks whether it is still within
// its validity period.
func Validate(key string) (*ParsedLicense, error) {
	lic, err := Parse(key)
	if err != nil {
		return nil, err
	}
	if time.Now().After(lic.ExpiresAt) {
		return lic, ErrLicenseExpired
	}
	return lic, nil
}

// DaysRemaining returns how many full days are left until expiry.
// Returns a negative number if already expired.
func DaysRemaining(expiresAt time.Time) int {
	return int(time.Until(expiresAt).Hours() / 24)
}

// Sign creates a license key from a payload using an Ed25519 private key.
// This is only used by the keygen CLI tool — never called from the app itself.
func Sign(p Payload, privateKey ed25519.PrivateKey) (string, error) {
	payloadBytes, err := json.Marshal(p)
	if err != nil {
		return "", err
	}
	sig := ed25519.Sign(privateKey, payloadBytes)
	encoded := keyPrefix +
		base64.RawURLEncoding.EncodeToString(payloadBytes) + "." +
		base64.RawURLEncoding.EncodeToString(sig)
	return encoded, nil
}
