package sync_test

import (
	"fmt"
	"testing"
	"time"

	"github.com/easiness/easiness-wails/internal/db"
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"github.com/easiness/easiness-wails/internal/service"
	internalsync "github.com/easiness/easiness-wails/internal/sync"
	"gorm.io/gorm"
)

// ── helpers ───────────────────────────────────────────────────────────────────

func newDB(t *testing.T, deviceID string) *gorm.DB {
	t.Helper()
	database, err := db.InitializeTest()
	if err != nil {
		t.Fatalf("init db: %v", err)
	}
	internalsync.RegisterCallbacks(database, deviceID)
	return database
}

func registerDevice(db *gorm.DB, id, name string) {
	db.Create(&models.DeviceRegistration{
		ID: id, Name: name,
		RegisteredAt: time.Now(),
		LastSeenAt:   time.Now(),
	})
}

// pushAll sends every SyncLog entry created by deviceID on src to the server service.
func pushAll(t *testing.T, src *gorm.DB, deviceID string, svc *internalsync.Service) *internalsync.PushResponse {
	t.Helper()
	var entries []models.SyncLog
	src.Where("device_id = ?", deviceID).Order("id ASC").Find(&entries)
	if len(entries) == 0 {
		t.Fatal("no SyncLog entries to push")
	}
	resp, err := svc.Push(internalsync.PushRequest{DeviceID: deviceID, Entries: entries})
	if err != nil {
		t.Fatalf("push: %v", err)
	}
	return resp
}

// pullAndApply fetches all entries for deviceID from the server and applies to dst.
func pullAndApply(t *testing.T, dst *gorm.DB, deviceID string, svc *internalsync.Service) {
	t.Helper()
	cursor := ""
	for {
		resp, err := svc.Pull(cursor, deviceID)
		if err != nil {
			t.Fatalf("pull: %v", err)
		}
		if len(resp.Entries) > 0 {
			if err := internalsync.Apply(dst, resp.Entries); err != nil {
				t.Fatalf("apply: %v", err)
			}
		}
		cursor = resp.NextCursor
		if !resp.HasMore {
			break
		}
	}
}

// ── tests ─────────────────────────────────────────────────────────────────────

// TestSync_AccountRoundTrip verifies the basic push → pull → apply cycle:
// create on device A, sync to server, pull on device B, verify presence.
func TestSync_AccountRoundTrip(t *testing.T) {
	deviceA := newDB(t, "DEV-A")
	server := newDB(t, "")
	deviceB := newDB(t, "DEV-B")

	registerDevice(server, "DEV-A", "Device A")
	registerDevice(server, "DEV-B", "Device B")
	registerDevice(deviceA, "DEV-A", "Device A")
	registerDevice(deviceB, "DEV-B", "Device B")

	svc := internalsync.NewService(server)

	// Create an account on device A.
	acctSvc := service.NewAccountService(deviceA)
	_, err := acctSvc.Save(dto.SaveAccountRequest{
		Type: "BANK", AccountName: "Main Bank", AccountNo: "ACC001",
	})
	if err != nil {
		t.Fatalf("create account: %v", err)
	}

	// SyncLog must have at least one INSERT entry.
	var logCount int64
	deviceA.Model(&models.SyncLog{}).Where("device_id = ?", "DEV-A").Count(&logCount)
	if logCount == 0 {
		t.Fatal("SyncLog empty after account creation")
	}

	// Push device A → server.
	resp := pushAll(t, deviceA, "DEV-A", svc)
	if len(resp.Accepted) == 0 {
		t.Fatalf("server accepted 0 entries (conflicts: %v)", resp.Conflicts)
	}

	// Pull server → device B.
	pullAndApply(t, deviceB, "DEV-B", svc)

	// Account should now exist on device B (found by name — integer IDs differ).
	var acct models.Account
	if err := deviceB.Where("account_name = ?", "Main Bank").First(&acct).Error; err != nil {
		t.Fatalf("account not found on device B: %v", err)
	}
	if acct.AccountNo != "ACC001" {
		t.Errorf("account_no: got %q, want %q", acct.AccountNo, "ACC001")
	}
}

// TestSync_SyncIDPreserved verifies that the ULID assigned on device A is preserved
// on device B after sync (it is the stable cross-device identity).
func TestSync_SyncIDPreserved(t *testing.T) {
	deviceA := newDB(t, "DEV-A")
	server := newDB(t, "")
	deviceB := newDB(t, "DEV-B")

	registerDevice(server, "DEV-A", "Device A")
	registerDevice(server, "DEV-B", "Device B")

	svc := internalsync.NewService(server)

	placeSvc := service.NewPlaceService(deviceA)
	_, err := placeSvc.Save(dto.SavePlaceRequest{Name: "Warehouse 1", Address: "123 Main St"})
	if err != nil {
		t.Fatalf("create place: %v", err)
	}

	// Capture the SyncID assigned on device A.
	var placeA models.Place
	deviceA.Where("name = ?", "Warehouse 1").First(&placeA)
	if placeA.SyncID == "" {
		t.Fatal("SyncID not assigned on device A")
	}

	pushAll(t, deviceA, "DEV-A", svc)
	pullAndApply(t, deviceB, "DEV-B", svc)

	// Device B should have the same SyncID even though integer IDs may differ.
	var placeB models.Place
	if err := deviceB.Where("sync_id = ?", placeA.SyncID).First(&placeB).Error; err != nil {
		t.Fatalf("place not found by SyncID on device B: %v", err)
	}
	if placeB.Name != "Warehouse 1" {
		t.Errorf("name: got %q, want %q", placeB.Name, "Warehouse 1")
	}
}

// TestSync_IdempotentPush verifies that pushing the same entries twice does not
// duplicate records on the server.
func TestSync_IdempotentPush(t *testing.T) {
	deviceA := newDB(t, "DEV-A")
	server := newDB(t, "")

	registerDevice(server, "DEV-A", "Device A")
	registerDevice(server, "DEV-B", "Device B")

	svc := internalsync.NewService(server)

	acctSvc := service.NewAccountService(deviceA)
	acctSvc.Save(dto.SaveAccountRequest{Type: "BANK", AccountName: "Test", AccountNo: "T01"})

	var entries []models.SyncLog
	deviceA.Where("device_id = ?", "DEV-A").Find(&entries)

	// Push twice.
	svc.Push(internalsync.PushRequest{DeviceID: "DEV-A", Entries: entries})
	svc.Push(internalsync.PushRequest{DeviceID: "DEV-A", Entries: entries})

	// Server SyncLog should have only one entry per original entry.
	var count int64
	server.Model(&models.SyncLog{}).Where("device_id = ?", "DEV-A").Count(&count)
	if count != int64(len(entries)) {
		t.Errorf("SyncLog count: got %d, want %d", count, len(entries))
	}
}

// TestSync_PullExcludesOwnDevice verifies that a device does not receive back its
// own entries when pulling from the server.
func TestSync_PullExcludesOwnDevice(t *testing.T) {
	deviceA := newDB(t, "DEV-A")
	server := newDB(t, "")

	registerDevice(server, "DEV-A", "Device A")
	svc := internalsync.NewService(server)

	acctSvc := service.NewAccountService(deviceA)
	acctSvc.Save(dto.SaveAccountRequest{Type: "BANK", AccountName: "Own Bank", AccountNo: "O01"})

	pushAll(t, deviceA, "DEV-A", svc)

	// Device A pulls — should get nothing back (its own data excluded).
	resp, err := svc.Pull("", "DEV-A")
	if err != nil {
		t.Fatalf("pull: %v", err)
	}
	if len(resp.Entries) != 0 {
		t.Errorf("device A received %d entries of its own data (expected 0)", len(resp.Entries))
	}
}

// TestSync_CursorPagination verifies that cursor-based pagination returns all entries
// without duplicates across multiple pulls.
func TestSync_CursorPagination(t *testing.T) {
	deviceA := newDB(t, "DEV-A")
	server := newDB(t, "")

	registerDevice(server, "DEV-A", "Device A")
	registerDevice(server, "DEV-B", "Device B")

	svc := internalsync.NewService(server)
	acctSvc := service.NewAccountService(deviceA)

	// Create 10 accounts — generates 10 SyncLog entries.
	for i := 0; i < 10; i++ {
		_, err := acctSvc.Save(dto.SaveAccountRequest{
			Type:        "BANK",
			AccountName: fmt.Sprintf("Bank %02d", i),
			AccountNo:   fmt.Sprintf("B%04d", i),
		})
		if err != nil {
			t.Fatalf("create account %d: %v", i, err)
		}
	}

	var allEntries []models.SyncLog
	deviceA.Where("device_id = ?", "DEV-A").Find(&allEntries)
	svc.Push(internalsync.PushRequest{DeviceID: "DEV-A", Entries: allEntries})

	// Pull in two batches using cursor.
	resp1, _ := svc.Pull("", "DEV-B")
	resp2, _ := svc.Pull(resp1.NextCursor, "DEV-B")

	seen := make(map[string]bool)
	for _, e := range append(resp1.Entries, resp2.Entries...) {
		if seen[e.ID] {
			t.Errorf("duplicate SyncLog entry %s across pages", e.ID)
		}
		seen[e.ID] = true
	}

	if len(seen) != len(allEntries) {
		t.Errorf("total entries across pages: got %d, want %d", len(seen), len(allEntries))
	}
}

// TestSync_TwoDevicesBidirectional verifies that changes on both devices are
// visible to each other after a push-pull cycle.
func TestSync_TwoDevicesBidirectional(t *testing.T) {
	deviceA := newDB(t, "DEV-A")
	deviceB := newDB(t, "DEV-B")
	server := newDB(t, "")

	registerDevice(server, "DEV-A", "Device A")
	registerDevice(server, "DEV-B", "Device B")

	svc := internalsync.NewService(server)

	// Device A creates a place.
	placeSvcA := service.NewPlaceService(deviceA)
	placeSvcA.Save(dto.SavePlaceRequest{Name: "Place Alpha", Address: "A-side"})

	// Device B creates a different place.
	placeSvcB := service.NewPlaceService(deviceB)
	placeSvcB.Save(dto.SavePlaceRequest{Name: "Place Beta", Address: "B-side"})

	// Both push to server.
	pushAll(t, deviceA, "DEV-A", svc)
	pushAll(t, deviceB, "DEV-B", svc)

	// Both pull from server.
	pullAndApply(t, deviceA, "DEV-A", svc)
	pullAndApply(t, deviceB, "DEV-B", svc)

	// Device A should now see Place Beta.
	var placeOnA models.Place
	if err := deviceA.Where("name = ?", "Place Beta").First(&placeOnA).Error; err != nil {
		t.Fatalf("Place Beta not found on device A after sync: %v", err)
	}

	// Device B should now see Place Alpha.
	var placeOnB models.Place
	if err := deviceB.Where("name = ?", "Place Alpha").First(&placeOnB).Error; err != nil {
		t.Fatalf("Place Alpha not found on device B after sync: %v", err)
	}
}
