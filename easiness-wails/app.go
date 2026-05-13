package main

import (
	"context"

	"github.com/easiness/easiness-wails/internal/dto"
	"github.com/easiness/easiness-wails/internal/service"
	internalsync "github.com/easiness/easiness-wails/internal/sync"
	"gorm.io/gorm"
)

// App is the Wails application struct. Every exported method becomes callable
// from the Svelte frontend via the auto-generated wailsjs bindings.
type App struct {
	ctx         context.Context
	db          *gorm.DB
	accountSvc  *service.AccountService
	peopleSvc   *service.PeopleService
	productSvc  *service.ProductService
	stockSvc    *service.StockService
	documentSvc *service.DocumentService
	txSvc       *service.TxService
	unitSvc     *service.UnitService
	placeSvc    *service.PlaceService
	dashSvc     *service.DashboardService
	bizSvc      *service.BusinessService
	authSvc     *service.AuthService
	licenseSvc  *service.LicenseService
	syncClient  *internalsync.Client  // nil until configured via SetSyncServer
}

func NewApp(db *gorm.DB) *App {
	return &App{
		db:          db,
		accountSvc:  service.NewAccountService(db),
		peopleSvc:   service.NewPeopleService(db),
		productSvc:  service.NewProductService(db),
		stockSvc:    service.NewStockService(db),
		documentSvc: service.NewDocumentService(db),
		txSvc:       service.NewTxService(db),
		unitSvc:     service.NewUnitService(db),
		placeSvc:    service.NewPlaceService(db),
		dashSvc:     service.NewDashboardService(db),
		bizSvc:      service.NewBusinessService(db),
		authSvc:     service.NewAuthService(db),
		licenseSvc:  service.NewLicenseService(db),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// ── Sync ─────────────────────────────────────────────────────────────────────

// ConfigureSync sets the remote server URL and device ID for background sync.
// Call this once the user has provided their server URL in settings.
func (a *App) ConfigureSync(serverURL, deviceID string) {
	a.syncClient = internalsync.NewClient(a.db, serverURL, deviceID)
}

// SyncNow performs a push-then-pull cycle. Returns the sync status.
func (a *App) SyncNow() (*internalsync.SyncStatusResponse, error) {
	if a.syncClient == nil {
		return &internalsync.SyncStatusResponse{IsOnline: false}, nil
	}
	return a.syncClient.Sync()
}

// GetSyncStatus returns the current sync state without making network calls.
func (a *App) GetSyncStatus() (*internalsync.SyncStatusResponse, error) {
	if a.syncClient == nil {
		return &internalsync.SyncStatusResponse{IsOnline: false}, nil
	}
	return a.syncClient.Status()
}

// ── License ───────────────────────────────────────────────────────────────────

func (a *App) GetLicenseStatus() (*dto.LicenseStatusResponse, error) {
	return a.licenseSvc.GetStatus()
}

func (a *App) ActivateLicense(req dto.ActivateLicenseRequest) (*dto.LicenseStatusResponse, error) {
	return a.licenseSvc.Activate(req)
}

// ── Auth ─────────────────────────────────────────────────────────────────────

func (a *App) IsSetupRequired() bool {
	return a.authSvc.IsSetupRequired()
}

func (a *App) SetupAuth(req dto.SetupAuthRequest) error {
	return a.authSvc.Setup(req)
}

func (a *App) Login(req dto.LoginRequest) (*dto.LoginResponse, error) {
	return a.authSvc.Login(req)
}

func (a *App) ChangePassword(req dto.ChangePasswordRequest) error {
	return a.authSvc.ChangePassword(req)
}

// ── Account ──────────────────────────────────────────────────────────────────

func (a *App) CreateAccount(req dto.SaveAccountRequest) (*dto.AccountResponse, error) {
	return a.accountSvc.Save(req)
}

func (a *App) UpdateAccount(req dto.SaveAccountRequest) (*dto.AccountResponse, error) {
	return a.accountSvc.Save(req)
}

func (a *App) SearchAccounts(req dto.AccountSearchRequest) (*dto.Page[dto.AccountResponse], error) {
	return a.accountSvc.Search(req)
}

func (a *App) GetAllAccounts() (map[uint]dto.AccountResponse, error) {
	return a.accountSvc.GetAll()
}

// ── People ───────────────────────────────────────────────────────────────────

func (a *App) CreatePeople(req dto.SavePeopleRequest) (*dto.PeopleResponse, error) {
	return a.peopleSvc.Save(req)
}

func (a *App) UpdatePeople(req dto.SavePeopleRequest) (*dto.PeopleResponse, error) {
	return a.peopleSvc.Save(req)
}

func (a *App) SearchPeople(req dto.PeopleSearchRequest) (*dto.Page[dto.PeopleResponse], error) {
	return a.peopleSvc.Search(req)
}

func (a *App) GetAllCustomers() ([]dto.PeopleResponse, error) {
	return a.peopleSvc.GetByType("CUSTOMER")
}

func (a *App) GetAllSuppliers() ([]dto.PeopleResponse, error) {
	return a.peopleSvc.GetByType("SUPPLIER")
}

func (a *App) GetAllPeople() ([]dto.PeopleResponse, error) {
	return a.peopleSvc.GetAll()
}

func (a *App) GetPeopleDetails(id uint) (*dto.PeopleDetailsResponse, error) {
	return a.peopleSvc.GetDetails(id)
}

// ── Product ──────────────────────────────────────────────────────────────────

func (a *App) CreateProduct(req dto.SaveProductRequest) (*dto.ProductResponse, error) {
	return a.productSvc.Create(req)
}

func (a *App) UpdateProduct(req dto.SaveProductRequest) (*dto.ProductResponse, error) {
	return a.productSvc.Update(req)
}

func (a *App) SearchProduct(req dto.ProductSearchRequest) (*dto.Page[dto.ProductResponse], error) {
	return a.productSvc.Search(req)
}

func (a *App) MoveProduct(req dto.MoveProductRequest) error {
	return a.productSvc.Move(req)
}

// ── Transaction ──────────────────────────────────────────────────────────────

func (a *App) SearchTransactions(req dto.TxSearchRequest) (*dto.Page[dto.TxResponse], error) {
	return a.txSvc.Search(req)
}

// ── Unit ─────────────────────────────────────────────────────────────────────

func (a *App) GetUnitData() (*dto.UnitDataResponse, error) {
	return a.unitSvc.GetAll()
}

// ── Place ────────────────────────────────────────────────────────────────────

func (a *App) CreatePlace(req dto.SavePlaceRequest) (*dto.PlaceResponse, error) {
	return a.placeSvc.Save(req)
}

func (a *App) UpdatePlace(req dto.SavePlaceRequest) (*dto.PlaceResponse, error) {
	return a.placeSvc.Save(req)
}

func (a *App) GetAllPlaces() ([]dto.PlaceResponse, error) {
	return a.placeSvc.GetAll()
}

// ── Stock ────────────────────────────────────────────────────────────────────

func (a *App) GetStock(req dto.StockSearchRequest) (*dto.Page[dto.StockResponse], error) {
	return a.stockSvc.Find(req)
}

func (a *App) AddInitialStock(req dto.InitialStockRequest) error {
	return a.stockSvc.AddInitialStock(req)
}

// ── Business ─────────────────────────────────────────────────────────────────

func (a *App) SavePurchaseOrder(req dto.SaveDocumentRequest) (*dto.DocumentResponse, error) {
	return a.bizSvc.SavePurchaseOrder(req)
}

func (a *App) SaveInvoice(req dto.SaveDocumentRequest) (*dto.DocumentResponse, error) {
	return a.bizSvc.SaveInvoice(req)
}

// ── Document ─────────────────────────────────────────────────────────────────

func (a *App) SearchDocuments(req dto.DocumentSearchRequest) (*dto.Page[dto.DocumentResponse], error) {
	return a.documentSvc.Search(req)
}

func (a *App) GetDocumentDetails(id uint) (*dto.DocumentDetailsResponse, error) {
	return a.documentSvc.GetDetails(id)
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

func (a *App) GetDashboard(req dto.DashboardRequest) (*dto.DashboardResponse, error) {
	return a.dashSvc.GetDashboard(req)
}
