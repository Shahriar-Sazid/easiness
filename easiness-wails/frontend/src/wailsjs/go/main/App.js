// AUTO-GENERATED stub — replaced by `wails generate module`.
// When running inside the Wails desktop shell, calls the Go-JS bridge directly.
// When running in a plain browser (web mode), falls back to the HTTP API.

// ---------- HTTP fallback -------------------------------------------------- //

const API_BASE = (() => {
  if (typeof window !== 'undefined' && window.__EASINESS_API__) return window.__EASINESS_API__
  if (typeof window !== 'undefined' && window.location.hostname !== '') {
    return `${window.location.origin}/api`
  }
  return 'http://localhost:8080/api'
})()

function getToken() {
  return typeof localStorage !== 'undefined' ? (localStorage.getItem('easiness_token') ?? '') : ''
}

async function httpCall(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: body !== undefined ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw err
  }
  if (res.status === 204) return undefined
  return res.json()
}

// ---------- Transport dispatcher ------------------------------------------- //

const call = (wailsMethod, httpPath, body) => {
  if (window?.go?.main?.App?.[wailsMethod]) {
    return body !== undefined
      ? window.go.main.App[wailsMethod](body)
      : window.go.main.App[wailsMethod]()
  }
  console.debug(`[web mode] ${wailsMethod} → ${httpPath}`)
  return httpCall(httpPath, body)
}

// ---------- Exports -------------------------------------------------------- //

export const GetLicenseStatus  = ()    => call('GetLicenseStatus',  '/license/status')
export const ActivateLicense   = (req) => call('ActivateLicense',   '/license/activate',    req)

export const IsSetupRequired   = ()    => call('IsSetupRequired',   '/auth/setup-required')
export const SetupAuth         = (req) => call('SetupAuth',         '/auth/setup',          req)
export const Login             = (req) => call('Login',             '/auth/login',          req)
export const ChangePassword    = (req) => call('ChangePassword',    '/auth/change-password', req)

export const CreateAccount     = (req) => call('CreateAccount',     '/accounts/create',     req)
export const UpdateAccount     = (req) => call('UpdateAccount',     '/accounts/update',     req)
export const SearchAccounts    = (req) => call('SearchAccounts',    '/accounts/search',     req)
export const GetAllAccounts    = ()    => call('GetAllAccounts',    '/accounts')

export const CreatePeople      = (req) => call('CreatePeople',      '/people/create',       req)
export const UpdatePeople      = (req) => call('UpdatePeople',      '/people/update',       req)
export const SearchPeople      = (req) => call('SearchPeople',      '/people/search',       req)
export const GetAllCustomers   = ()    => call('GetAllCustomers',   '/people/customers')
export const GetAllSuppliers   = ()    => call('GetAllSuppliers',   '/people/suppliers')
export const GetAllPeople      = ()    => call('GetAllPeople',      '/people')
export const GetPeopleDetails  = (id)  => call('GetPeopleDetails',  `/people/${id}`)

export const CreateProduct     = (req) => call('CreateProduct',     '/products/create',     req)
export const UpdateProduct     = (req) => call('UpdateProduct',     '/products/update',     req)
export const SearchProduct     = (req) => call('SearchProduct',     '/products/search',     req)
export const MoveProduct       = (req) => call('MoveProduct',       '/products/move',       req)

export const SearchTransactions = (req) => call('SearchTransactions', '/transactions/search', req)
export const GetUnitData        = ()    => call('GetUnitData',        '/units')

export const CreatePlace        = (req) => call('CreatePlace',        '/places/create',       req)
export const UpdatePlace        = (req) => call('UpdatePlace',        '/places/update',       req)
export const GetAllPlaces       = ()    => call('GetAllPlaces',       '/places')

export const GetStock           = (req) => call('GetStock',           '/stock/search',        req)
export const AddInitialStock    = (req) => call('AddInitialStock',    '/stock/add-initial',   req)

export const SavePurchaseOrder  = (req) => call('SavePurchaseOrder',  '/business/purchase',   req)
export const SaveInvoice        = (req) => call('SaveInvoice',        '/business/invoice',    req)

export const SearchDocuments    = (req) => call('SearchDocuments',    '/documents/search',    req)
export const GetDocumentDetails = (id)  => call('GetDocumentDetails', `/documents/${id}`)

export const GetDashboard       = (req) => call('GetDashboard',       '/dashboard',           req)

export const SyncNow            = ()    => call('SyncNow',            '/sync/trigger')
export const GetSyncStatus      = ()    => call('GetSyncStatus',      '/sync/status')
export const ConfigureSync      = (req) => call('ConfigureSync',      '/sync/configure',      req)
