package db

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// InitializePostgres opens a PostgreSQL database and runs all migrations.
// dsn is a standard libpq connection string, e.g.:
//
//	postgres://user:pass@host:5432/dbname?sslmode=disable
func InitializePostgres(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, err
	}

	if err := migrate(db); err != nil {
		return nil, err
	}

	if err := Seed(db); err != nil {
		return nil, err
	}

	return db, nil
}
