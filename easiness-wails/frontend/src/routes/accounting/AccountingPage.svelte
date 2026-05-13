<script lang="ts">
  import { onMount } from 'svelte'
  import { GetAllAccounts, SearchTransactions, CreateAccount, UpdateAccount } from '../../wailsjs/go/main/App'
  import type { dto_AccountResponse, dto_Page, dto_TxResponse } from '../../wailsjs/go/models'
  import { formatAmount, formatDateTime, txTypeBadgeClass } from '../../lib/format'
  import Modal from '../../components/shared/Modal.svelte'
  import Pagination from '../../components/shared/Pagination.svelte'
  import Spinner from '../../components/shared/Spinner.svelte'
  import { uiStore } from '../../stores/ui'

  let accounts: Record<number, dto_AccountResponse> = {}
  let txPage: dto_Page<dto_TxResponse> | null = null
  let loadingTx = false
  let showAccountModal = false
  let editAccount: Partial<dto_AccountResponse> = {}

  let txFilters = { type: '', page: 0, size: 20 }

  async function loadAccounts() {
    accounts = await GetAllAccounts()
  }

  async function loadTx(p = 0) {
    loadingTx = true
    try {
      txPage = await SearchTransactions({ ...txFilters, page: p })
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Failed to load transactions')
    } finally {
      loadingTx = false
    }
  }

  onMount(async () => {
    await loadAccounts()
    await loadTx()
  })

  async function saveAccount() {
    try {
      const req = { ...editAccount, balance: editAccount.balance ?? '0' } as any
      if (editAccount.id) {
        await UpdateAccount(req)
        uiStore.success('Account updated')
      } else {
        await CreateAccount(req)
        uiStore.success('Account created')
      }
      showAccountModal = false
      editAccount = {}
      await loadAccounts()
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Save failed')
    }
  }

  function openNewAccount() { editAccount = { type: 'CASH' }; showAccountModal = true }
  function openEditAccount(acc: dto_AccountResponse) { editAccount = { ...acc }; showAccountModal = true }
</script>

<h4 class="mb-4">Accounting</h4>

<!-- Accounts Section -->
<div class="d-flex justify-content-between align-items-center mb-3">
  <h5 class="mb-0">Bank Accounts</h5>
  <button class="btn btn-primary btn-sm" on:click={openNewAccount}><i class="bi bi-plus-lg me-1"></i> Add Account</button>
</div>

<div class="row g-3 mb-4">
  {#each Object.values(accounts) as acc}
    <div class="col-md-4">
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div>
              <div class="fw-medium">{acc.accountName}</div>
              <small class="text-muted">{acc.holderName} · {acc.accountNo}</small>
            </div>
            <button class="btn btn-sm btn-link p-0" on:click={() => openEditAccount(acc)}>
              <i class="bi bi-pencil text-primary"></i>
            </button>
          </div>
          <div class="mt-2 fw-bold fs-5">{formatAmount(acc.balance)}</div>
          <span class="badge bg-secondary">{acc.type}</span>
        </div>
      </div>
    </div>
  {:else}
    <div class="col-12 text-muted">No accounts yet</div>
  {/each}
</div>

<!-- Transactions Section -->
<div class="d-flex justify-content-between align-items-center mb-3">
  <h5 class="mb-0">Transactions</h5>
  <select class="form-select form-select-sm" style="width:auto" bind:value={txFilters.type} on:change={() => loadTx(0)}>
    <option value="">All Types</option>
    <option value="INCOME">Income</option>
    <option value="EXPENSE">Expense</option>
    <option value="BANK_TRANSFER">Transfer</option>
  </select>
</div>

<div class="card">
  <div class="card-body p-0">
    {#if loadingTx}
      <div class="text-center py-4"><Spinner /></div>
    {:else if txPage}
      <table class="table table-sm table-hover mb-0">
        <thead><tr><th>Date</th><th>Type</th><th>People</th><th>From</th><th>To</th><th>Description</th><th class="text-end">Amount</th></tr></thead>
        <tbody>
          {#each txPage.content as tx}
            <tr>
              <td>{formatDateTime(tx.createdAt)}</td>
              <td><span class="badge rounded-pill {txTypeBadgeClass(tx.type)}">{tx.type}</span></td>
              <td>{tx.people?.name ?? '—'}</td>
              <td>{tx.fromAccount?.accountName ?? '—'}</td>
              <td>{tx.toAccount?.accountName ?? '—'}</td>
              <td>{tx.description || '—'}</td>
              <td class="text-end">{formatAmount(tx.amount)}</td>
            </tr>
          {:else}
            <tr><td colspan="7" class="text-center text-muted py-4">No transactions</td></tr>
          {/each}
        </tbody>
      </table>
      <div class="d-flex justify-content-between p-3">
        <small class="text-muted">{txPage.totalElements} transaction(s)</small>
        <Pagination page={txPage} onPageChange={loadTx} />
      </div>
    {/if}
  </div>
</div>

<!-- Account Modal -->
<Modal show={showAccountModal} title={editAccount.id ? 'Edit Account' : 'New Account'} onClose={() => { showAccountModal = false; editAccount = {} }}>
  <div class="mb-3">
    <label class="form-label">Type</label>
    <select class="form-select" bind:value={editAccount.type}>
      <option value="CASH">Cash</option>
      <option value="BANK">Bank</option>
    </select>
  </div>
  <div class="mb-3">
    <label class="form-label">Account Name *</label>
    <input class="form-control" bind:value={editAccount.accountName} />
  </div>
  <div class="mb-3">
    <label class="form-label">Holder Name *</label>
    <input class="form-control" bind:value={editAccount.holderName} />
  </div>
  <div class="mb-3">
    <label class="form-label">Account No *</label>
    <input class="form-control" bind:value={editAccount.accountNo} />
  </div>
  {#if editAccount.type === 'BANK'}
    <div class="row g-2 mb-3">
      <div class="col"><input class="form-control" placeholder="Bank" bind:value={editAccount.bank} /></div>
      <div class="col"><input class="form-control" placeholder="Branch" bind:value={editAccount.branch} /></div>
    </div>
  {/if}
  <svelte:fragment slot="footer">
    <button class="btn btn-secondary btn-sm" on:click={() => { showAccountModal = false }}>Cancel</button>
    <button class="btn btn-primary btn-sm" on:click={saveAccount}>Save</button>
  </svelte:fragment>
</Modal>
