<script lang="ts">
  import { onMount } from 'svelte'
  import { GetStock } from '../../wailsjs/go/main/App'
  import type { dto_Page, dto_StockResponse } from '../../wailsjs/go/models'
  import { formatAmount, formatQuantity } from '../../lib/format'
  import Pagination from '../../components/shared/Pagination.svelte'
  import Spinner from '../../components/shared/Spinner.svelte'
  import { uiStore } from '../../stores/ui'

  let page: dto_Page<dto_StockResponse> | null = null
  let loading = false
  let currentPage = 0

  async function load(p = 0) {
    loading = true
    try {
      page = await GetStock({ page: p, size: 20 })
      currentPage = p
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Failed to load stock')
    } finally {
      loading = false
    }
  }

  onMount(() => load())
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4>Stock Inventory</h4>
</div>

<div class="card">
  <div class="card-body p-0">
    {#if loading}
      <div class="text-center py-5"><Spinner /></div>
    {:else if page}
      <table class="table table-hover mb-0">
        <thead>
          <tr><th>#</th><th>Product</th><th>Place</th><th class="text-end">Quantity</th><th>Unit</th><th class="text-end">Cost</th><th class="text-end">Last Price</th></tr>
        </thead>
        <tbody>
          {#each page.content as s, i}
            <tr>
              <td class="text-muted">{currentPage * 20 + i + 1}</td>
              <td>
                <div class="fw-medium">{s.product?.name ?? '—'}</div>
                {#if s.product?.size}<small class="text-muted">{s.product.size}</small>{/if}
              </td>
              <td>{s.place?.name ?? '—'}</td>
              <td class="text-end">{formatQuantity(s.quantity)}</td>
              <td>{s.unit?.name ?? '—'}</td>
              <td class="text-end">{formatAmount(s.cost)}</td>
              <td class="text-end">{formatAmount(s.latestPrice)}</td>
            </tr>
          {:else}
            <tr><td colspan="7" class="text-center text-muted py-4">No stock records</td></tr>
          {/each}
        </tbody>
      </table>
      <div class="d-flex justify-content-between p-3">
        <small class="text-muted">{page.totalElements} record(s)</small>
        <Pagination {page} onPageChange={load} />
      </div>
    {/if}
  </div>
</div>
