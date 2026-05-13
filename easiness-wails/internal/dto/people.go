package dto

import "github.com/shopspring/decimal"

type ContactNoInput struct {
	ID  uint   `json:"id"`
	No  string `json:"no"`
}

type SavePeopleRequest struct {
	ID            uint             `json:"id"`
	Name          string           `json:"name"`
	CompanyName   string           `json:"companyName"`
	Address       string           `json:"address"`
	Type          string           `json:"type"`
	Email         string           `json:"email"`
	ContactNoList []ContactNoInput `json:"contactNoList"`
}

type PeopleSearchRequest struct {
	SearchRequest
	Name        string `json:"name"`
	CompanyName string `json:"companyName"`
	Type        string `json:"type"`
}

type PeopleResponse struct {
	ID            uint            `json:"id"`
	Name          string          `json:"name"`
	CompanyName   string          `json:"companyName"`
	Address       string          `json:"address"`
	Type          string          `json:"type"`
	Email         string          `json:"email"`
	Balance       decimal.Decimal `json:"balance"`
	ContactNoList []ContactNoDTO  `json:"contactNoList"`
}

type ContactNoDTO struct {
	ID  uint   `json:"id"`
	No  string `json:"no"`
}

type PeopleDetailsResponse struct {
	People       PeopleResponse `json:"people"`
	Transactions []TxResponse   `json:"transactions"`
}
