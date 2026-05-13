package service

import (
	"strings"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/models"
	"gorm.io/gorm"
)

type PeopleService struct{ db *gorm.DB }

func NewPeopleService(db *gorm.DB) *PeopleService { return &PeopleService{db: db} }

func (s *PeopleService) Save(req dto.SavePeopleRequest) (*dto.PeopleResponse, error) {
	if err := s.validateUnique(req); err != nil {
		return nil, err
	}

	contacts := make([]models.ContactNo, len(req.ContactNoList))
	for i, c := range req.ContactNoList {
		contacts[i] = models.ContactNo{ID: c.ID, No: c.No}
	}

	p := models.People{
		Name:          req.Name,
		CompanyName:   req.CompanyName,
		Address:       req.Address,
		Type:          models.PeopleType(req.Type),
		Email:         req.Email,
		ContactNoList: contacts,
	}
	if req.ID != 0 {
		p.ID = req.ID
		// Replace contact numbers on update.
		s.db.Where("owner_id = ?", req.ID).Delete(&models.ContactNo{})
	}

	if err := s.db.Save(&p).Error; err != nil {
		return nil, err
	}
	return toPeopleResponse(&p), nil
}

func (s *PeopleService) Search(req dto.PeopleSearchRequest) (*dto.Page[dto.PeopleResponse], error) {
	var records []models.People
	var total int64

	q := s.db.Model(&models.People{}).Preload("ContactNoList").
		Where("(:name = '' OR LOWER(name) LIKE '%' || :name || '%')", map[string]interface{}{"name": strings.ToLower(req.Name)}).
		Where("(:company = '' OR LOWER(company_name) LIKE '%' || :company || '%')", map[string]interface{}{"company": strings.ToLower(req.CompanyName)}).
		Where("(:type = '' OR type = :type)", map[string]interface{}{"type": req.Type})

	q.Count(&total)
	if err := q.Offset(req.Offset()).Limit(req.Limit()).Find(&records).Error; err != nil {
		return nil, err
	}

	responses := make([]dto.PeopleResponse, len(records))
	for i, r := range records {
		responses[i] = *toPeopleResponse(&r)
	}
	return dto.NewPage(responses, total, req.SearchRequest), nil
}

func (s *PeopleService) GetByType(pType string) ([]dto.PeopleResponse, error) {
	var records []models.People
	if err := s.db.Preload("ContactNoList").Where("type = ? OR type = ?", pType, "BOTH").Find(&records).Error; err != nil {
		return nil, err
	}
	out := make([]dto.PeopleResponse, len(records))
	for i, r := range records {
		out[i] = *toPeopleResponse(&r)
	}
	return out, nil
}

func (s *PeopleService) GetAll() ([]dto.PeopleResponse, error) {
	var records []models.People
	if err := s.db.Preload("ContactNoList").Find(&records).Error; err != nil {
		return nil, err
	}
	out := make([]dto.PeopleResponse, len(records))
	for i, r := range records {
		out[i] = *toPeopleResponse(&r)
	}
	return out, nil
}

func (s *PeopleService) GetDetails(id uint) (*dto.PeopleDetailsResponse, error) {
	var p models.People
	if err := s.db.Preload("ContactNoList").First(&p, id).Error; err != nil {
		return nil, dto.NewError(dto.ErrEntityNotFound, "people not found")
	}

	var txs []models.Tx
	s.db.Preload("FromAccount").Preload("ToAccount").
		Where("people_id = ?", id).
		Order("created_at DESC").
		Limit(50).
		Find(&txs)

	txResponses := make([]dto.TxResponse, len(txs))
	for i, t := range txs {
		txResponses[i] = *toTxResponse(&t)
	}

	return &dto.PeopleDetailsResponse{
		People:       *toPeopleResponse(&p),
		Transactions: txResponses,
	}, nil
}

func (s *PeopleService) validateUnique(req dto.SavePeopleRequest) error {
	var existing []models.People
	s.db.Where("name = ? AND company_name = ?", req.Name, req.CompanyName).Find(&existing)
	for _, e := range existing {
		if req.ID != 0 && e.ID == req.ID {
			continue
		}
		return dto.NewError(dto.ErrDupPeopleName, "people already exists: "+req.Name+" / "+req.CompanyName)
	}
	return nil
}

func toPeopleResponse(p *models.People) *dto.PeopleResponse {
	contacts := make([]dto.ContactNoDTO, len(p.ContactNoList))
	for i, c := range p.ContactNoList {
		contacts[i] = dto.ContactNoDTO{ID: c.ID, No: c.No}
	}
	return &dto.PeopleResponse{
		ID:            p.ID,
		Name:          p.Name,
		CompanyName:   p.CompanyName,
		Address:       p.Address,
		Type:          string(p.Type),
		Email:         p.Email,
		Balance:       p.Balance,
		ContactNoList: contacts,
	}
}
