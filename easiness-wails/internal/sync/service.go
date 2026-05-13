package sync

import (
	"time"

	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

const pullPageSize = 500

// Service handles server-side sync operations.
type Service struct{ db *gorm.DB }

func NewService(db *gorm.DB) *Service { return &Service{db: db} }

// RegisterDevice creates or refreshes a DeviceRegistration.
func (s *Service) RegisterDevice(req RegisterDeviceRequest) (*RegisterDeviceResponse, error) {
	dev := models.DeviceRegistration{
		ID:           NewULID(),
		Name:         req.Name,
		RegisteredAt: time.Now(),
		LastSeenAt:   time.Now(),
	}
	if err := s.db.Create(&dev).Error; err != nil {
		return nil, err
	}
	return &RegisterDeviceResponse{DeviceID: dev.ID}, nil
}

// Push accepts SyncLog entries from a device and stores them.
// Conflict resolution is last-ULID-wins: if an entry for the same (table, syncID)
// already exists with a higher ULID (i.e. was written later), the incoming entry is
// skipped and reported as conflicted.
func (s *Service) Push(req PushRequest) (*PushResponse, error) {
	resp := &PushResponse{}

	for _, entry := range req.Entries {
		entry.DeviceID = req.DeviceID

		// Check for a newer entry for the same record
		var existing models.SyncLog
		err := s.db.
			Where("table_name = ? AND sync_id = ? AND id > ?", entry.TableName, entry.SyncID, entry.ID).
			First(&existing).Error

		if err == nil {
			// A newer entry already exists — skip (conflict)
			resp.Conflicts = append(resp.Conflicts, entry.ID)
			continue
		}

		// Upsert: ignore if already stored (idempotent)
		if err := SkipSyncLog(s.db).
			Where(models.SyncLog{ID: entry.ID}).
			FirstOrCreate(&entry).Error; err != nil {
			return nil, err
		}
		resp.Accepted = append(resp.Accepted, entry.ID)
	}

	// Update device last-seen
	s.db.Model(&models.DeviceRegistration{}).
		Where("id = ?", req.DeviceID).
		Updates(map[string]any{"last_seen_at": time.Now()})

	return resp, nil
}

// Pull returns SyncLog entries that the device has not yet seen.
// cursor is the ULID of the last entry the device received (empty = from beginning).
// Entries from the requesting device are excluded (don't send a device its own data).
func (s *Service) Pull(cursor, deviceID string) (*PullResponse, error) {
	query := s.db.Model(&models.SyncLog{}).
		Where("device_id != ?", deviceID).
		Order("id ASC").
		Limit(pullPageSize + 1)

	if cursor != "" {
		query = query.Where("id > ?", cursor)
	}

	var entries []models.SyncLog
	if err := query.Find(&entries).Error; err != nil {
		return nil, err
	}

	hasMore := len(entries) > pullPageSize
	if hasMore {
		entries = entries[:pullPageSize]
	}

	nextCursor := cursor
	if len(entries) > 0 {
		nextCursor = entries[len(entries)-1].ID
	}

	return &PullResponse{
		Entries:    entries,
		NextCursor: nextCursor,
		HasMore:    hasMore,
	}, nil
}
