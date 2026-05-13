package dto

type SaveProductRequest struct {
	ID            uint   `json:"id"`
	Name          string `json:"name"`
	Type          string `json:"type"`
	Brand         string `json:"brand"`
	Country       string `json:"country"`
	Size          string `json:"size"`
	PreferredUnit uint   `json:"preferredUnit"`
}

type ProductSearchRequest struct {
	SearchRequest
	Name    string `json:"name"`
	Type    string `json:"type"`
	Brand   string `json:"brand"`
	Country string `json:"country"`
	Size    string `json:"size"`
}

type ProductResponse struct {
	ID            uint   `json:"id"`
	Name          string `json:"name"`
	Type          string `json:"type"`
	Brand         string `json:"brand"`
	Country       string `json:"country"`
	Size          string `json:"size"`
	PreferredUnit uint   `json:"preferredUnit"`
}

type MoveProductRequest struct {
	ProductID    uint   `json:"productId"`
	FromPlaceID  uint   `json:"fromPlaceId"`
	ToPlaceID    uint   `json:"toPlaceId"`
	Quantity     string `json:"quantity"`
	UnitID       uint   `json:"unitId"`
}
