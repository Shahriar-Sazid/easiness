package sync

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

// Client is the desktop-side sync agent. It pushes pending SyncLog entries
// to the server and pulls new entries back.
type Client struct {
	db       *gorm.DB
	serverURL string // base URL, e.g. "https://easiness.example.com"
	deviceID string
	httpClient *http.Client
}

func NewClient(db *gorm.DB, serverURL, deviceID string) *Client {
	return &Client{
		db:        db,
		serverURL: serverURL,
		deviceID:  deviceID,
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

// Sync performs a full push-then-pull cycle. Returns a status summary.
func (c *Client) Sync() (*SyncStatusResponse, error) {
	if err := c.push(); err != nil {
		return nil, fmt.Errorf("push: %w", err)
	}
	if err := c.pull(); err != nil {
		return nil, fmt.Errorf("pull: %w", err)
	}
	return c.Status()
}

// Status returns the current sync state without making any network calls.
func (c *Client) Status() (*SyncStatusResponse, error) {
	var pending int64
	c.db.Model(&models.SyncLog{}).
		Where("device_id = ?", c.deviceID).
		Where("id > (SELECT COALESCE(last_cursor,'') FROM device_registrations WHERE id = ?)", c.deviceID).
		Count(&pending)

	var dev models.DeviceRegistration
	c.db.Where("id = ?", c.deviceID).First(&dev)

	return &SyncStatusResponse{
		DeviceID:    c.deviceID,
		LastCursor:  dev.LastCursor,
		PendingPush: int(pending),
		IsOnline:    true,
	}, nil
}

// push sends all un-pushed local SyncLog entries to the server.
func (c *Client) push() error {
	var dev models.DeviceRegistration
	if err := c.db.Where("id = ?", c.deviceID).First(&dev).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil // not registered yet
		}
		return err
	}

	var entries []models.SyncLog
	query := c.db.Where("device_id = ?", c.deviceID).Order("id ASC").Limit(500)
	// Only push entries we haven't pushed yet (id > last pushed marker)
	// We track this by looking at what the server acknowledged.
	// Simple approach: push everything, server deduplicates.
	if err := query.Find(&entries).Error; err != nil {
		return err
	}
	if len(entries) == 0 {
		return nil
	}

	req := PushRequest{DeviceID: c.deviceID, Entries: entries}
	body, _ := json.Marshal(req)

	resp, err := c.httpClient.Post(c.serverURL+"/api/sync/push", "application/json", bytes.NewReader(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("server returned %d", resp.StatusCode)
	}
	return nil
}

// pull fetches new entries from the server and applies them locally.
func (c *Client) pull() error {
	var dev models.DeviceRegistration
	if err := c.db.Where("id = ?", c.deviceID).First(&dev).Error; err != nil {
		return nil // not registered
	}

	cursor := dev.LastCursor
	for {
		url := fmt.Sprintf("%s/api/sync/pull?cursor=%s&device=%s", c.serverURL, cursor, c.deviceID)
		resp, err := c.httpClient.Get(url)
		if err != nil {
			return err
		}
		if resp.StatusCode != http.StatusOK {
			resp.Body.Close()
			return fmt.Errorf("server returned %d", resp.StatusCode)
		}

		var pullResp PullResponse
		if err := json.NewDecoder(resp.Body).Decode(&pullResp); err != nil {
			resp.Body.Close()
			return err
		}
		resp.Body.Close()

		if len(pullResp.Entries) > 0 {
			if err := Apply(c.db, pullResp.Entries); err != nil {
				return err
			}
		}

		cursor = pullResp.NextCursor
		// Persist cursor so we resume here next time
		c.db.Model(&models.DeviceRegistration{}).
			Where("id = ?", c.deviceID).
			Update("last_cursor", cursor)

		if !pullResp.HasMore {
			break
		}
	}
	return nil
}
