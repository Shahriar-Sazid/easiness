<script lang="ts">
  import { onMount } from 'svelte'
  import { push, params } from 'svelte-spa-router'
  import { GetPeopleDetails } from '../../wailsjs/go/main/App'
  import type { dto_PeopleDetailsResponse } from '../../wailsjs/go/models'
  import { formatAmount, formatDateTime, txTypeBadgeClass, peopleTypeBadgeClass } from '../../lib/format'
  import { uiStore } from '../../stores/ui'
  import Spinner from '../../components/shared/Spinner.svelte'

  $: id = $params?.id ? parseInt($params.id) : 0
  let details: dto_PeopleDetailsResponse | null = null
  let loading = true

  onMount(async () => {
    try {
      details = await GetPeopleDetails(id)
    } catch (e: any) {
      uiStore.error('Person not found')
      push('/people')
    } finally {
      loading = false
    }
  })
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4>Person Details</h4>
  <div class="d-flex gap-2">
    <button class="btn btn-outline-primary btn-sm" on:click={() => push(`/people/${id}/edit`)}>
      <i class="bi bi-pencil me-1"></i> Edit
    </button>
    <button class="btn btn-outline-secondary btn-sm" on:click={() => push('/people')}>
      <i class="bi bi-arrow-left me-1"></i> Back
    </button>
  </div>
</div>

{#if loading}
  <div class="text-center py-5"><Spinner /></div>
{:else if details}
  <div class="row g-3">
    <div class="col-md-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{details.people.name}</h5>
          <p class="text-muted mb-2">{details.people.companyName}</p>
          <span class="badge {peopleTypeBadgeClass(details.people.type)}">{details.people.type}</span>
          <hr />
          {#if details.people.email}<p><i class="bi bi-envelope me-2 text-muted"></i>{details.people.email}</p>{/if}
          {#if details.people.address}<p><i class="bi bi-geo-alt me-2 text-muted"></i>{details.people.address}</p>{/if}
          {#each details.people.contactNoList as contact}
            <p><i class="bi bi-telephone me-2 text-muted"></i>{contact.no}</p>
          {/each}
          <hr />
          <div class="d-flex justify-content-between">
            <span class="text-muted">Balance</span>
            <span class="fw-bold" class:text-success={parseFloat(details.people.balance) >= 0} class:text-danger={parseFloat(details.people.balance) < 0}>
              {formatAmount(details.people.balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">Transaction History</div>
        <div class="card-body p-0">
          <table class="table table-sm mb-0">
            <thead><tr><th>Date</th><th>Type</th><th>Ref</th><th class="text-end">Amount</th></tr></thead>
            <tbody>
              {#each details.transactions as tx}
                <tr>
                  <td>{formatDateTime(tx.createdAt)}</td>
                  <td><span class="badge rounded-pill {txTypeBadgeClass(tx.type)}">{tx.type}</span></td>
                  <td>{tx.ref || '—'}</td>
                  <td class="text-end">{formatAmount(tx.amount)}</td>
                </tr>
              {:else}
                <tr><td colspan="4" class="text-center text-muted py-4">No transactions</td></tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
{/if}
