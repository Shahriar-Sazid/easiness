<script lang="ts">
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { SearchProduct } from '../../wailsjs/go/main/App'
  import type { dto_Page, dto_ProductResponse } from '../../wailsjs/go/models'
  import Pagination from '../../components/shared/Pagination.svelte'
  import Spinner from '../../components/shared/Spinner.svelte'
  import { uiStore } from '../../stores/ui'
  import { unitsStore } from '../../stores/units'
  import { getUnitName } from '../../stores/units'

  let page: dto_Page<dto_ProductResponse> | null = null
  let loading = false
  let currentPage = 0

  let filters = { name: '', type: '', brand: '', country: '', size: '' }

  async function load(p = 0) {
    loading = true
    try {
      page = await SearchProduct({ ...filters, page: p, size: 20 })
      currentPage = p
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Failed to load products')
    } finally {
      loading = false
    }
  }

  onMount(() => load())

  function handleSearch() { load(0) }
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4 class="mb-0">Products</h4>
  <button class="btn btn-primary btn-sm" on:click={() => push('/products/new')}>
    <i class="bi bi-plus-lg me-1"></i> Add Product
  </button>
</div>

<!-- Search Bar -->
<div class="card mb-3">
  <div class="card-body">
    <form class="row g-2" on:submit|preventDefault={handleSearch}>
      <div class="col-md-3"><input class="form-control form-control-sm" placeholder="Name" bind:value={filters.name} /></div>
      <div class="col-md-2"><input class="form-control form-control-sm" placeholder="Type" bind:value={filters.type} /></div>
      <div class="col-md-2"><input class="form-control form-control-sm" placeholder="Brand" bind:value={filters.brand} /></div>
      <div class="col-md-2"><input class="form-control form-control-sm" placeholder="Country" bind:value={filters.country} /></div>
      <div class="col-md-2"><input class="form-control form-control-sm" placeholder="Size" bind:value={filters.size} /></div>
      <div class="col-md-1"><button type="submit" class="btn btn-primary btn-sm w-100">Search</button></div>
    </form>
  </div>
</div>

<div class="card">
  <div class="card-body p-0">
    {#if loading}
      <div class="text-center py-5"><Spinner /></div>
    {:else if page}
      <table class="table table-hover mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Brand</th>
            <th>Country</th>
            <th>Size</th>
            <th>Unit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each page.content as product, i}
            <tr>
              <td class="text-muted">{currentPage * 20 + i + 1}</td>
              <td class="fw-medium">{product.name}</td>
              <td>{product.type || '—'}</td>
              <td>{product.brand || '—'}</td>
              <td>{product.country}</td>
              <td>{product.size || '—'}</td>
              <td>{getUnitName($unitsStore.units, product.preferredUnit)}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary" on:click={() => push(`/products/${product.id}`)}>
                  <i class="bi bi-pencil"></i>
                </button>
              </td>
            </tr>
          {:else}
            <tr><td colspan="8" class="text-center text-muted py-4">No products found</td></tr>
          {/each}
        </tbody>
      </table>
      <div class="d-flex justify-content-between align-items-center p-3">
        <small class="text-muted">{page.totalElements} product(s)</small>
        <Pagination {page} onPageChange={load} />
      </div>
    {/if}
  </div>
</div>
