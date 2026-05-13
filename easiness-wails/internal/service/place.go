package service

import (
	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

type PlaceService struct{ db *gorm.DB }

func NewPlaceService(db *gorm.DB) *PlaceService { return &PlaceService{db: db} }

func (s *PlaceService) Save(req dto.SavePlaceRequest) (*dto.PlaceResponse, error) {
	place := models.Place{Name: req.Name, Address: req.Address}
	if req.ID != 0 {
		place.ID = req.ID
	}
	if err := s.db.Save(&place).Error; err != nil {
		return nil, err
	}
	return &dto.PlaceResponse{ID: place.ID, Name: place.Name, Address: place.Address}, nil
}

func (s *PlaceService) GetAll() ([]dto.PlaceResponse, error) {
	var places []models.Place
	if err := s.db.Find(&places).Error; err != nil {
		return nil, err
	}
	out := make([]dto.PlaceResponse, len(places))
	for i, p := range places {
		out[i] = dto.PlaceResponse{ID: p.ID, Name: p.Name, Address: p.Address}
	}
	return out, nil
}
