package sync

import "github.com/easiness/easiness-wails/internal/models"

// PushRequest is sent by a desktop device to upload its pending SyncLog entries.
type PushRequest struct {
	DeviceID string            `json:"deviceId"`
	Entries  []models.SyncLog  `json:"entries"`
}

// PushResponse tells the client which entries were accepted and which conflicted.
type PushResponse struct {
	Accepted  []string `json:"accepted"`  // SyncLog IDs accepted
	Conflicts []string `json:"conflicts"` // SyncLog IDs rejected due to conflict
}

// PullResponse returns SyncLog entries the client has not yet seen.
type PullResponse struct {
	Entries    []models.SyncLog `json:"entries"`
	NextCursor string           `json:"nextCursor"` // ULID to use as cursor on next pull
	HasMore    bool             `json:"hasMore"`
}

// RegisterDeviceRequest is sent once per device to obtain a persistent device ID.
type RegisterDeviceRequest struct {
	Name string `json:"name"` // e.g. "John's laptop"
}

// RegisterDeviceResponse returns the assigned device ULID.
type RegisterDeviceResponse struct {
	DeviceID string `json:"deviceId"`
}

// SyncStatusResponse is returned to the frontend to display sync state.
type SyncStatusResponse struct {
	DeviceID    string `json:"deviceId"`
	LastCursor  string `json:"lastCursor"`
	PendingPush int    `json:"pendingPush"` // count of local entries not yet pushed
	IsOnline    bool   `json:"isOnline"`
}
