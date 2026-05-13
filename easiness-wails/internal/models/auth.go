package models

// LocalAuth holds the single local user's hashed password.
// Desktop apps are single-user so we only ever have one row.
type LocalAuth struct {
	ID           uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	PasswordHash string `gorm:"not null"                 json:"-"`
}
