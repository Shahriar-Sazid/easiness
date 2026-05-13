// AUTO-GENERATED stub — replaced by `wails generate module`.
// In production this file calls the real Wails Go-JS bridge.
// During frontend-only development it calls the window.go bridge if present,
// or returns mock data if running in a plain browser.

const call = (method, ...args) => {
  if (window?.go?.main?.App?.[method]) {
    return window.go.main.App[method](...args)
  }
  console.warn(`[wailsjs stub] ${method} called but Wails runtime not available`)
  return Promise.resolve(null)
}

export const GetLicenseStatus = () => call('GetLicenseStatus')
export const ActivateLicense = (req) => call('ActivateLicense', req)

export const IsSetupRequired = () => call('IsSetupRequired')
export const SetupAuth = (req) => call('SetupAuth', req)
export const Login = (req) => call('Login', req)
export const ChangePassword = (req) => call('ChangePassword', req)

export const CreateAccount = (req) => call('CreateAccount', req)
export const UpdateAccount = (req) => call('UpdateAccount', req)
export const SearchAccounts = (req) => call('SearchAccounts', req)
export const GetAllAccounts = () => call('GetAllAccounts')

export const CreatePeople = (req) => call('CreatePeople', req)
export const UpdatePeople = (req) => call('UpdatePeople', req)
export const SearchPeople = (req) => call('SearchPeople', req)
export const GetAllCustomers = () => call('GetAllCustomers')
export const GetAllSuppliers = () => call('GetAllSuppliers')
export const GetAllPeople = () => call('GetAllPeople')
export const GetPeopleDetails = (id) => call('GetPeopleDetails', id)

export const CreateProduct = (req) => call('CreateProduct', req)
export const UpdateProduct = (req) => call('UpdateProduct', req)
export const SearchProduct = (req) => call('SearchProduct', req)
export const MoveProduct = (req) => call('MoveProduct', req)

export const SearchTransactions = (req) => call('SearchTransactions', req)
export const GetUnitData = () => call('GetUnitData')

export const CreatePlace = (req) => call('CreatePlace', req)
export const UpdatePlace = (req) => call('UpdatePlace', req)
export const GetAllPlaces = () => call('GetAllPlaces')

export const GetStock = (req) => call('GetStock', req)
export const AddInitialStock = (req) => call('AddInitialStock', req)

export const SavePurchaseOrder = (req) => call('SavePurchaseOrder', req)
export const SaveInvoice = (req) => call('SaveInvoice', req)

export const SearchDocuments = (req) => call('SearchDocuments', req)
export const GetDocumentDetails = (id) => call('GetDocumentDetails', id)

export const GetDashboard = (req) => call('GetDashboard', req)
