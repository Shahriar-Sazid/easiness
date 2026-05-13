package service

import (
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

type UnitService struct{ db *gorm.DB }

func NewUnitService(db *gorm.DB) *UnitService { return &UnitService{db: db} }

func (s *UnitService) GetAll() (*dto.UnitDataResponse, error) {
	var units []models.Unit
	if err := s.db.Find(&units).Error; err != nil {
		return nil, err
	}
	var conversions []models.UnitConversion
	if err := s.db.Find(&conversions).Error; err != nil {
		return nil, err
	}

	unitDTOs := make([]dto.UnitDTO, len(units))
	for i, u := range units {
		unitDTOs[i] = dto.UnitDTO{ID: u.ID, Name: u.Name}
	}

	convDTOs := make([]dto.UnitConversionDTO, len(conversions))
	for i, c := range conversions {
		convDTOs[i] = dto.UnitConversionDTO{
			ID:       c.ID,
			From:     c.From,
			To:       c.To,
			CalStep:  c.CalStep,
			Operator: c.Operator,
			Constant: c.Constant,
		}
	}

	return &dto.UnitDataResponse{Units: unitDTOs, Conversions: convDTOs}, nil
}
