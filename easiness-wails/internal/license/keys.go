package license

// EmbeddedPublicKey is the Ed25519 public key used to verify license signatures.
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  ⚠️  PRODUCTION SETUP — MUST DO BEFORE SHIPPING                         │
// │                                                                         │
// │  1. Generate your production keypair (run ONCE, keep private key safe): │
// │       go run ./cmd/keygen --gen-keys                                    │
// │  2. Copy the printed public key bytes below, replacing TEST_PUBLIC_KEY. │
// │  3. Store private.key securely (password manager / offline device).     │
// │  4. NEVER commit private.key to version control.                        │
// └─────────────────────────────────────────────────────────────────────────┘
//
// The value below is a TEST keypair — safe for development, NOT for production.
// Replace with your real public key before building a distributable release.
var EmbeddedPublicKey = []byte{
	// TEST KEY — replace before production build
	0x68, 0x76, 0x4c, 0xb3, 0x3b, 0xdd, 0x12, 0x67,
	0xfd, 0xbc, 0x2d, 0xc5, 0xb3, 0x84, 0x99, 0xb3,
	0x1c, 0xd3, 0xec, 0x5a, 0x99, 0xa2, 0x5c, 0x07,
	0x4a, 0x91, 0x89, 0xb3, 0x6e, 0x7c, 0x55, 0x51,
}

// TestPrivateKey is the Ed25519 private key matching EmbeddedPublicKey above.
// Used ONLY in tests — never referenced by the production app binary.
// Replace both keys after running: go run ./cmd/keygen --gen-keys
var TestPrivateKey = []byte{
	// TEST PRIVATE KEY — for tests only, never ship
	0x9e, 0x55, 0xd7, 0xf6, 0xa2, 0x47, 0x8a, 0x34,
	0xbc, 0x4c, 0x2f, 0x8b, 0x91, 0x6d, 0x32, 0x10,
	0x7e, 0xf8, 0x21, 0x04, 0x5d, 0x3c, 0x9b, 0x8a,
	0xf1, 0x65, 0x23, 0x7d, 0x44, 0x0e, 0x6b, 0x29,
	// Public key half (Ed25519 private key includes the public key)
	0x68, 0x76, 0x4c, 0xb3, 0x3b, 0xdd, 0x12, 0x67,
	0xfd, 0xbc, 0x2d, 0xc5, 0xb3, 0x84, 0x99, 0xb3,
	0x1c, 0xd3, 0xec, 0x5a, 0x99, 0xa2, 0x5c, 0x07,
	0x4a, 0x91, 0x89, 0xb3, 0x6e, 0x7c, 0x55, 0x51,
}
