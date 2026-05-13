package sync

import "github.com/easiness/easiness-wails/internal/uid"

// NewULID delegates to the shared leaf uid package.
func NewULID() string { return uid.New() }
