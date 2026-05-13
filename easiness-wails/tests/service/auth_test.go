package service_test

import (
	"testing"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/service"
)

func TestAuthSetupAndLogin(t *testing.T) {
	svc := service.NewAuthService(newTestDB(t))

	if !svc.IsSetupRequired() {
		t.Error("expected setup required on empty DB")
	}

	if err := svc.Setup(dto.SetupAuthRequest{Password: "secret123"}); err != nil {
		t.Fatalf("setup failed: %v", err)
	}

	if svc.IsSetupRequired() {
		t.Error("setup should not be required after setup")
	}

	resp, err := svc.Login(dto.LoginRequest{Password: "secret123"})
	if err != nil {
		t.Fatalf("login failed: %v", err)
	}
	if !resp.Success {
		t.Error("expected login success")
	}
}

func TestAuthLogin_WrongPassword(t *testing.T) {
	svc := service.NewAuthService(newTestDB(t))
	svc.Setup(dto.SetupAuthRequest{Password: "correct"})

	resp, err := svc.Login(dto.LoginRequest{Password: "wrong"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.Success {
		t.Error("expected login failure with wrong password")
	}
}

func TestAuthChangePassword(t *testing.T) {
	svc := service.NewAuthService(newTestDB(t))
	svc.Setup(dto.SetupAuthRequest{Password: "oldpass"})

	if err := svc.ChangePassword(dto.ChangePasswordRequest{OldPassword: "oldpass", NewPassword: "newpass"}); err != nil {
		t.Fatalf("change password failed: %v", err)
	}

	resp, _ := svc.Login(dto.LoginRequest{Password: "newpass"})
	if !resp.Success {
		t.Error("expected login with new password to succeed")
	}

	resp, _ = svc.Login(dto.LoginRequest{Password: "oldpass"})
	if resp.Success {
		t.Error("expected old password to be rejected")
	}
}
