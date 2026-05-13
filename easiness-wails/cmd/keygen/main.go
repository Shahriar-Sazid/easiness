// keygen — Easiness License Key Generator
//
// This tool is for the SELLER only. Never distribute it to customers.
//
// Usage:
//
//	# Step 1: Generate your keypair ONCE (keep private.key secret forever)
//	go run ./cmd/keygen --gen-keys
//
//	# Step 2: Generate a 1-year license key for a customer
//	go run ./cmd/keygen --private private.key --years 1
//
//	# Generate a 2-year key
//	go run ./cmd/keygen --private private.key --years 2
//
//	# Generate a key expiring on a specific date
//	go run ./cmd/keygen --private private.key --expiry 2028-12-31
//
//	# Generate a professional-tier key
//	go run ./cmd/keygen --private private.key --years 1 --type professional
//
//	# Inspect / verify an existing key (using the embedded public key)
//	go run ./cmd/keygen --verify "EASINESS-eyJ2Ij..."
package main

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/hex"
	"flag"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/easiness/easiness-wails/internal/license"
)

func main() {
	genKeys  := flag.Bool("gen-keys", false, "Generate a new Ed25519 keypair")
	private  := flag.String("private", "", "Path to private key file (hex)")
	years    := flag.Int("years", 0, "License duration in years")
	expiry   := flag.String("expiry", "", "Exact expiry date (YYYY-MM-DD), overrides --years")
	licType  := flag.String("type", "standard", "License type: standard | professional | enterprise")
	seats    := flag.Int("seats", 1, "Number of seats")
	verify   := flag.String("verify", "", "License key string to verify and inspect")
	flag.Parse()

	switch {
	case *genKeys:
		generateKeypair()

	case *verify != "":
		verifyKey(*verify)

	case *private != "":
		if *years == 0 && *expiry == "" {
			fatal("specify --years or --expiry")
		}
		generateLicense(*private, *years, *expiry, *licType, *seats)

	default:
		flag.Usage()
	}
}

// ── keypair generation ────────────────────────────────────────────────────────

func generateKeypair() {
	pub, priv, err := ed25519.GenerateKey(rand.Reader)
	check(err)

	privHex := hex.EncodeToString(priv)
	pubHex := hex.EncodeToString(pub)

	// Write private key to file
	check(os.WriteFile("private.key", []byte(privHex+"\n"), 0o600))
	// Write public key to file
	check(os.WriteFile("public.key", []byte(pubHex+"\n"), 0o644))

	fmt.Println("✅ Keypair generated:")
	fmt.Println("   private.key  ← KEEP SECRET — never commit, never share")
	fmt.Println("   public.key   ← embed in the app binary")
	fmt.Println()
	fmt.Println("─────────────────────────────────────────────────────────────")
	fmt.Println("Paste the following into internal/license/keys.go to replace")
	fmt.Println("EmbeddedPublicKey (and delete TestPrivateKey from that file):")
	fmt.Println("─────────────────────────────────────────────────────────────")
	fmt.Println()
	fmt.Println("var EmbeddedPublicKey = []byte{")
	printBytes(pub)
	fmt.Println("}")
}

func printBytes(b []byte) {
	for i, v := range b {
		if i%8 == 0 {
			fmt.Print("\t")
		}
		fmt.Printf("0x%02x, ", v)
		if (i+1)%8 == 0 {
			fmt.Println()
		}
	}
	if len(b)%8 != 0 {
		fmt.Println()
	}
}

// ── license key generation ────────────────────────────────────────────────────

func generateLicense(privPath string, years int, expiryStr, licType string, seats int) {
	privHex, err := os.ReadFile(privPath)
	check(err)

	privBytes, err := hex.DecodeString(strings.TrimSpace(string(privHex)))
	check(err)

	if len(privBytes) != ed25519.PrivateKeySize {
		fatal("private key file has wrong length (got %d bytes, want %d)", len(privBytes), ed25519.PrivateKeySize)
	}
	privKey := ed25519.PrivateKey(privBytes)

	var expiresAt time.Time
	if expiryStr != "" {
		expiresAt, err = time.Parse("2006-01-02", expiryStr)
		check(err)
	} else {
		expiresAt = time.Now().AddDate(years, 0, 0)
	}

	payload := license.Payload{
		Version: 1,
		Expiry:  expiresAt.Format("2006-01-02"),
		Type:    licType,
		Seats:   seats,
	}

	key, err := license.Sign(payload, privKey)
	check(err)

	fmt.Println()
	fmt.Println("✅ License Key Generated")
	fmt.Println("─────────────────────────────────────────────────────────────")
	fmt.Println(key)
	fmt.Println("─────────────────────────────────────────────────────────────")
	fmt.Printf("Type    : %s\n", licType)
	fmt.Printf("Seats   : %d\n", seats)
	fmt.Printf("Expires : %s (%d days from today)\n",
		expiresAt.Format("2006-01-02"),
		int(time.Until(expiresAt).Hours()/24),
	)
}

// ── verify ────────────────────────────────────────────────────────────────────

func verifyKey(key string) {
	parsed, err := license.Parse(key)
	if err != nil {
		fmt.Printf("❌ Invalid: %v\n", err)
		os.Exit(1)
	}

	days := license.DaysRemaining(parsed.ExpiresAt)
	expired := days < 0

	fmt.Println()
	if expired {
		fmt.Printf("⚠️  EXPIRED (%d days ago)\n", -days)
	} else {
		fmt.Printf("✅ Valid (%d days remaining)\n", days)
	}
	fmt.Println("─────────────────────────────────────────────────────────────")
	fmt.Printf("Type    : %s\n", parsed.Type)
	fmt.Printf("Seats   : %d\n", parsed.Seats)
	fmt.Printf("Expires : %s\n", parsed.ExpiresAt.Format("2006-01-02"))
}

// ── helpers ───────────────────────────────────────────────────────────────────

func check(err error) {
	if err != nil {
		fatal("%v", err)
	}
}

func fatal(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "error: "+format+"\n", args...)
	os.Exit(1)
}
