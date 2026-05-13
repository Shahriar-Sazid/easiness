<script lang="ts">
  import { onMount } from 'svelte'
  import Router from 'svelte-spa-router'
  import { authStore } from './stores/auth'
  import { unitsStore } from './stores/units'
  import { uiStore } from './stores/ui'
  import Sidebar from './components/shared/Sidebar.svelte'
  import Topbar from './components/shared/Topbar.svelte'
  import ToastContainer from './components/shared/ToastContainer.svelte'
  import Spinner from './components/shared/Spinner.svelte'
  import LoginPage from './routes/LoginPage.svelte'
  import SetupPage from './routes/SetupPage.svelte'

  import Dashboard from './routes/dashboard/Dashboard.svelte'
  import ProductList from './routes/product/ProductList.svelte'
  import ProductForm from './routes/product/ProductForm.svelte'
  import PeopleList from './routes/people/PeopleList.svelte'
  import PeopleForm from './routes/people/PeopleForm.svelte'
  import PeopleDetails from './routes/people/PeopleDetails.svelte'
  import AccountingPage from './routes/accounting/AccountingPage.svelte'
  import BuyPage from './routes/business/BuyPage.svelte'
  import SellPage from './routes/business/SellPage.svelte'
  import PlacePage from './routes/place/PlacePage.svelte'
  import StockPage from './routes/stock/StockPage.svelte'

  const routes = {
    '/': Dashboard,
    '/dashboard': Dashboard,
    '/products': ProductList,
    '/products/new': ProductForm,
    '/products/:id': ProductForm,
    '/people': PeopleList,
    '/people/new': PeopleForm,
    '/people/:id/edit': PeopleForm,
    '/people/:id': PeopleDetails,
    '/accounting': AccountingPage,
    '/business/buy': BuyPage,
    '/business/sell': SellPage,
    '/places': PlacePage,
    '/stock': StockPage,
  }

  let isLoading = true
  let isLoggedIn = false
  let setupRequired: boolean | null = null

  authStore.subscribe(s => {
    isLoading = s.isLoading
    isLoggedIn = s.isLoggedIn
    setupRequired = s.setupRequired
  })

  onMount(async () => {
    await authStore.init()
    if ($authStore.isLoggedIn || !$authStore.setupRequired) {
      await unitsStore.load()
    }
  })

  $: if (isLoggedIn) {
    unitsStore.load()
  }
</script>

{#if isLoading}
  <div class="d-flex justify-content-center align-items-center" style="height:100vh">
    <Spinner size="lg" />
  </div>
{:else if setupRequired === true}
  <SetupPage />
{:else if !isLoggedIn}
  <LoginPage />
{:else}
  <div class="app-layout">
    <Sidebar />
    <div class="main-content">
      <Topbar />
      <main class="page-content">
        <Router {routes} />
      </main>
    </div>
  </div>
{/if}

<ToastContainer />
