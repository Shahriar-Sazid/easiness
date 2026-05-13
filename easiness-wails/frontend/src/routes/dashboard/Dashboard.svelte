<script lang="ts">
  import { onMount } from 'svelte'
  import { GetDashboard } from '../../wailsjs/go/main/App'
  import type { dto_DashboardResponse } from '../../wailsjs/go/models'
  import { formatAmount, formatDateTime } from '../../lib/format'
  import Spinner from '../../components/shared/Spinner.svelte'
  import { uiStore } from '../../stores/ui'

  let data: dto_DashboardResponse | null = null
  let loading = true

  onMount(async () => {
    try {
      data = await GetDashboard({})
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Failed to load dashboard')
    } finally {
      loading = false
    }
  })
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4 class="mb-0">Dashboard</h4>
</div>

{#if loading}
  <div class="text-center py-5"><Spinner /></div>
{:else if data}
  <!-- Summary Cards -->
  <div class="row g-3 mb-4">
    <div class="col-md-4">
      <div class="card stat-card">
        <div class="stat-value text-success">{formatAmount(data.totalAccountBalance)}</div>
        <div class="stat-label">Total Account Balance</div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card stat-card">
        <div class="stat-value text-warning">{formatAmount(data.totalReceivable)}</div>
        <div class="stat-label">Total Receivable</div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card stat-card">
        <div class="stat-value text-danger">{formatAmount(data.totalPayable)}</div>
        <div class="stat-label">Total Payable</div>
      </div>
    </div>
  </div>

  <!-- Top Products -->
  <div class="row g-3 mb-4">
    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-header">Top Products by Profit</div>
        <div class="card-body p-0">
          <table class="table table-sm mb-0">
            <thead><tr><th>Product</th><th class="text-end">Profit</th></tr></thead>
            <tbody>
              {#each data.topProductsByProfit as p}
                <tr><td>{p.label}</td><td class="text-end text-success">{formatAmount(p.value)}</td></tr>
              {:else}
                <tr><td colspan="2" class="text-center text-muted py-3">No data</td></tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-header">Top Products by Quantity Sold</div>
        <div class="card-body p-0">
          <table class="table table-sm mb-0">
            <thead><tr><th>Product</th><th class="text-end">Qty</th></tr></thead>
            <tbody>
              {#each data.topProductsByQuantity as p}
                <tr><td>{p.label}</td><td class="text-end">{p.value}</td></tr>
              {:else}
                <tr><td colspan="2" class="text-center text-muted py-3">No data</td></tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent Transactions -->
  <div class="card">
    <div class="card-header">Recent Transactions</div>
    <div class="card-body p-0">
      <table class="table table-sm mb-0">
        <thead><tr><th>Date</th><th>Type</th><th>People</th><th class="text-end">Amount</th></tr></thead>
        <tbody>
          {#each data.recentTransactions as tx}
            <tr>
              <td>{formatDateTime(tx.createdAt)}</td>
              <td><span class="badge rounded-pill {tx.type === 'INCOME' ? 'badge-income' : tx.type === 'EXPENSE' ? 'badge-expense' : 'badge-transfer'}">{tx.type}</span></td>
              <td>{tx.people?.name ?? '—'}</td>
              <td class="text-end">{formatAmount(tx.amount)}</td>
            </tr>
          {:else}
            <tr><td colspan="4" class="text-center text-muted py-3">No transactions</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}
