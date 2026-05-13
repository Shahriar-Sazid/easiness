// Package uid is a leaf package (no internal imports) that provides
// thread-safe ULID generation shared by both internal/models and internal/sync.
package uid

import (
	"math/rand"
	"sync"
	"time"

	"github.com/oklog/ulid/v2"
)

var (
	entropy     = ulid.Monotonic(rand.New(rand.NewSource(time.Now().UnixNano())), 0)
	entropyLock sync.Mutex
)

// New returns a new ULID string. Thread-safe; monotonically increasing within
// the same millisecond so sort order is preserved under high write rate.
func New() string {
	entropyLock.Lock()
	id := ulid.MustNew(ulid.Timestamp(time.Now()), entropy)
	entropyLock.Unlock()
	return id.String()
}
