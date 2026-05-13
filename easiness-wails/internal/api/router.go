package api

import (
	"net/http"

	"github.com/easiness/easiness-wails/internal/api/handlers"
	apimw "github.com/easiness/easiness-wails/internal/api/middleware"
	"github.com/easiness/easiness-wails/internal/service"
	internalsync "github.com/easiness/easiness-wails/internal/sync"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"
)

// NewRouter builds and returns the Echo router with all routes registered.
func NewRouter(db *gorm.DB, jwtSecret, frontendDir string) *echo.Echo {
	e := echo.New()
	e.HideBanner = true

	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())

	// Serve compiled Svelte frontend
	e.Static("/", frontendDir)
	e.GET("/", func(c echo.Context) error {
		return c.File(frontendDir + "/index.html")
	})

	// ── Services ──────────────────────────────────────────────────────────────
	accountSvc  := service.NewAccountService(db)
	peopleSvc   := service.NewPeopleService(db)
	productSvc  := service.NewProductService(db)
	stockSvc    := service.NewStockService(db)
	bizSvc      := service.NewBusinessService(db, stockSvc)
	docSvc      := service.NewDocumentService(db)
	txSvc       := service.NewTxService(db)
	unitSvc     := service.NewUnitService(db)
	placeSvc    := service.NewPlaceService(db)
	dashSvc     := service.NewDashboardService(db)
	authSvc     := service.NewAuthService(db)
	syncSvc     := internalsync.NewService(db)

	// ── Handlers ──────────────────────────────────────────────────────────────
	authH := handlers.NewAuthHandler(authSvc, jwtSecret)
	accH  := handlers.NewAccountHandler(accountSvc)
	pepH  := handlers.NewPeopleHandler(peopleSvc)
	proH  := handlers.NewProductHandler(productSvc)
	bizH  := handlers.NewBusinessHandler(bizSvc, docSvc, txSvc, stockSvc, unitSvc, placeSvc, dashSvc)
	synH  := handlers.NewSyncHandler(syncSvc)

	// ── Public routes (no auth required) ──────────────────────────────────────
	pub := e.Group("/api")
	pub.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})
	pub.GET("/auth/setup-required", authH.IsSetupRequired)
	pub.POST("/auth/setup", authH.Setup)
	pub.POST("/auth/login", authH.Login)

	// ── Protected routes ──────────────────────────────────────────────────────
	api := e.Group("/api", apimw.JWTMiddleware(jwtSecret))

	// Auth
	api.POST("/auth/change-password", authH.ChangePassword)

	// Accounts
	api.POST("/accounts/create",  accH.Create)
	api.POST("/accounts/update",  accH.Update)
	api.POST("/accounts/search",  accH.Search)
	api.GET("/accounts",          accH.GetAll)

	// People
	api.POST("/people/create",    pepH.Create)
	api.POST("/people/update",    pepH.Update)
	api.POST("/people/search",    pepH.Search)
	api.GET("/people",            pepH.GetAll)
	api.GET("/people/customers",  pepH.GetCustomers)
	api.GET("/people/suppliers",  pepH.GetSuppliers)
	api.GET("/people/:id",        pepH.GetDetails)

	// Products
	api.POST("/products/create",  proH.Create)
	api.POST("/products/update",  proH.Update)
	api.POST("/products/search",  proH.Search)
	api.POST("/products/move",    proH.Move)

	// Business
	api.POST("/business/purchase", bizH.SavePurchaseOrder)
	api.POST("/business/invoice",  bizH.SaveInvoice)

	// Documents
	api.POST("/documents/search",  bizH.SearchDocuments)
	api.GET("/documents/:id",      bizH.GetDocumentDetails)

	// Transactions
	api.POST("/transactions/search", bizH.SearchTransactions)

	// Stock
	api.POST("/stock/search",        bizH.GetStock)
	api.POST("/stock/add-initial",   bizH.AddInitialStock)

	// Units & Places
	api.GET("/units",               bizH.GetUnitData)
	api.POST("/places/create",      bizH.CreatePlace)
	api.POST("/places/update",      bizH.UpdatePlace)
	api.GET("/places",              bizH.GetAllPlaces)

	// Dashboard
	api.POST("/dashboard",          bizH.GetDashboard)

	// Sync
	api.POST("/sync/register", synH.Register)
	api.POST("/sync/push",     synH.Push)
	api.GET("/sync/pull",      synH.Pull)

	return e
}
