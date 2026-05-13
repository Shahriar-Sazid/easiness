package service

import (
	"errors"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct{ db *gorm.DB }

func NewAuthService(db *gorm.DB) *AuthService { return &AuthService{db: db} }

func (s *AuthService) IsSetupRequired() bool {
	var count int64
	s.db.Model(&models.LocalAuth{}).Count(&count)
	return count == 0
}

func (s *AuthService) Setup(req dto.SetupAuthRequest) error {
	if !s.IsSetupRequired() {
		return dto.NewError("ALREADY_SETUP", "auth already configured")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	return s.db.Create(&models.LocalAuth{PasswordHash: string(hash)}).Error
}

func (s *AuthService) Login(req dto.LoginRequest) (*dto.LoginResponse, error) {
	var auth models.LocalAuth
	if err := s.db.First(&auth).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, dto.NewError(dto.ErrAuthNotSetup, "run setup first")
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(auth.PasswordHash), []byte(req.Password)); err != nil {
		return &dto.LoginResponse{Success: false, Message: "invalid password"}, nil
	}
	return &dto.LoginResponse{Success: true, Message: "ok"}, nil
}

func (s *AuthService) ChangePassword(req dto.ChangePasswordRequest) error {
	var auth models.LocalAuth
	if err := s.db.First(&auth).Error; err != nil {
		return dto.NewError(dto.ErrAuthNotSetup, "auth not configured")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(auth.PasswordHash), []byte(req.OldPassword)); err != nil {
		return dto.NewError(dto.ErrInvalidCredentials, "old password incorrect")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	auth.PasswordHash = string(hash)
	return s.db.Save(&auth).Error
}
