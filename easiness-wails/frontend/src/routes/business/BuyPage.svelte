<script lang="ts">
  import { onMount } from 'svelte'
  import { SavePurchaseOrder, GetAllSuppliers, GetAllAccounts, GetAllPlaces, SearchProduct } from '../../wailsjs/go/main/App'
  import type { dto_PeopleResponse, dto_AccountResponse, dto_PlaceResponse, dto_ProductResponse, dto_DocumentItemInput, dto_PaymentInput } from '../../wailsjs/go/models'
  import { formatAmount } from '../../lib/format'
  import { unitsStore } from '../../stores/units'
  import { uiStore } from '../../stores/ui'
  import Spinner from '../../components/shared/Spinner.svelte'

  let suppliers: dto_PeopleResponse[] = []
  let accounts: dto_AccountResponse[] = []
  let places: dto_PlaceResponse[] = []
  let products: dto_ProductResponse[] = []

  let selectedSupplier = 0
  let items: Array<dto_DocumentItemInput & { _key: number }> = []
  let payments: Array<dto_PaymentInput & { _key: number }> = []
  let submitting = false
  let _key = 0

  onMount(async () => {
    [suppliers, accounts, places] = await Promise.all([GetAllSuppliers(), Object.values(await GetAllAccounts()), GetAllPlaces()])
    const page = await SearchProduct({ page: 0, size: 200 })
    products = page.content
  })

  function addItem() {
    items = [...items, { _key: ++_key, productId: 0, quantity: '1', cost: '0', unitId: 1, placeId: places[0]?.id ?? 0 }]
  }

  function removeItem(key: number) {
    items = items.filter(i => i._key !== key)
  }

  function addPayment() {
    payments = [...payments, { _key: ++_key, amount: '0', fromAccount: accounts[0]?.id ?? 0 }]
  }

  function removePayment(key: number) {
    payments = payments.filter(p => p._key !== key)
  }

  $: total = items.reduce((sum, i) => sum + (parseFloat(i.quantity) * parseFloat(i.cost) || 0), 0)
  $: paidTotal = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)

  async function handleSubmit() {
    if (!selectedSupplier) { uiStore.error('Select a supplier'); return }
    if (items.length === 0) { uiStore.error('Add at least one item'); return }

    submitting = true
    try {
      await SavePurchaseOrder({
        peopleId: selectedSupplier,
        items: items.map(({ _key, ...i }) => i),
        payments: payments.map(({ _key, ...p }) => p),
      })
      uiStore.success('Purchase order saved')
      items = []
      payments = []
      selectedSupplier = 0
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Failed to save purchase order')
    } finally {
      submitting = false
    }
  }
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4 class="mb-0">New Purchase Order</h4>
</div>

<div class="card mb-3">
  <div class="card-body">
    <label class="form-label">Supplier *</label>
    <select class="form-select" style="max-width:360px" bind:value={selectedSupplier}>
      <option value={0}>— Select Supplier —</option>
      {#each suppliers as s}<option value={s.id}>{s.name} ({s.companyName})</option>{/each}
    </select>
  </div>
</div>

<!-- Items -->
<div class="card mb-3">
  <div class="card-header d-flex justify-content-between align-items-center">
    <span>Items</span>
    <button class="btn btn-sm btn-outline-primary" on:click={addItem}><i class="bi bi-plus"></i> Add</button>
  </div>
  <div class="card-body p-0">
    <table class="table table-sm mb-0">
      <thead><tr><th>Product</th><th>Qty</th><th>Unit</th><th>Place</th><th>Cost/Unit</th><th>Subtotal</th><th></th></tr></thead>
      <tbody>
        {#each items as item (item._key)}
          <tr>
            <td style="min-width:200px">
              <select class="form-select form-select-sm" bind:value={item.productId}>
                <option value={0}>Select…</option>
                {#each products as p}<option value={p.id}>{p.name} {p.size ? '(' + p.size + ')' : ''}</option>{/each}
              </select>
            </td>
            <td><input type="number" class="form-control form-control-sm" style="width:80px" bind:value={item.quantity} min="0.001" step="any" /></td>
            <td>
              <select class="form-select form-select-sm" style="width:80px" bind:value={item.unitId}>
                {#each $unitsStore.units as u}<option value={u.id}>{u.name}</option>{/each}
              </select>
            </td>
            <td>
              <select class="form-select form-select-sm" style="width:120px" bind:value={item.placeId}>
                {#each places as pl}<option value={pl.id}>{pl.name}</option>{/each}
              </select>
            </td>
            <td><input type="number" class="form-control form-control-sm" style="width:100px" bind:value={item.cost} min="0" step="any" /></td>
            <td class="align-middle">{formatAmount((parseFloat(item.quantity) * parseFloat(item.cost) || 0).toString())}</td>
            <td><button class="btn btn-sm btn-link text-danger" on:click={() => removeItem(item._key)}><i class="bi bi-trash"></i></button></td>
          </tr>
        {:else}
          <tr><td colspan="7" class="text-center text-muted py-3">No items. Click "+ Add" to add.</td></tr>
        {/each}
      </tbody>
      {#if items.length > 0}
        <tfoot>
          <tr><td colspan="5" class="text-end fw-bold">Total</td><td colspan="2" class="fw-bold">{formatAmount(total.toString())}</td></tr>
        </tfoot>
      {/if}
    </table>
  </div>
</div>

<!-- Payments -->
<div class="card mb-3">
  <div class="card-header d-flex justify-content-between align-items-center">
    <span>Payments <small class="text-muted">(optional)</small></span>
    <button class="btn btn-sm btn-outline-primary" on:click={addPayment}><i class="bi bi-plus"></i> Add</button>
  </div>
  <div class="card-body p-0">
    <table class="table table-sm mb-0">
      <thead><tr><th>From Account</th><th>Amount</th><th></th></tr></thead>
      <tbody>
        {#each payments as payment (payment._key)}
          <tr>
            <td>
              <select class="form-select form-select-sm" bind:value={payment.fromAccount}>
                {#each accounts as a}<option value={a.id}>{a.accountName}</option>{/each}
              </select>
            </td>
            <td><input type="number" class="form-control form-control-sm" style="width:140px" bind:value={payment.amount} min="0" step="any" /></td>
            <td><button class="btn btn-sm btn-link text-danger" on:click={() => removePayment(payment._key)}><i class="bi bi-trash"></i></button></td>
          </tr>
        {:else}
          <tr><td colspan="3" class="text-center text-muted py-3">No payments (unpaid = balance added to supplier)</td></tr>
        {/each}
      </tbody>
      {#if payments.length > 0}
        <tfoot>
          <tr>
            <td class="text-end fw-bold">Paid</td>
            <td colspan="2" class="fw-bold">{formatAmount(paidTotal.toString())}</td>
          </tr>
        </tfoot>
      {/if}
    </table>
  </div>
</div>

<div class="d-flex gap-2">
  <button class="btn btn-success" disabled={submitting} on:click={handleSubmit}>
    {#if submitting}<Spinner size="sm" />{:else}<i class="bi bi-check-circle me-1"></i> Save Purchase Order{/if}
  </button>
</div>
