<script lang="ts">
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { SearchPeople } from '../../wailsjs/go/main/App'
  import type { dto_Page, dto_PeopleResponse } from '../../wailsjs/go/models'
  import Pagination from '../../components/shared/Pagination.svelte'
  import Spinner from '../../components/shared/Spinner.svelte'
  import { formatAmount, formatPeopleName, peopleTypeBadgeClass } from '../../lib/format'
  import { uiStore } from '../../stores/ui'

  let page: dto_Page<dto_PeopleResponse> | null = null
  let loading = false
  let currentPage = 0
  let filters = { name: '', companyName: '', type: '' }

  async function load(p = 0) {
    loading = true
    try {
      page = await SearchPeople({ ...filters, page: p, size: 20 })
      currentPage = p
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Failed to load people')
    } finally {
      loading = false
    }
  }

  onMount(() => load())
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4 class="mb-0">People</h4>
  <button class="btn btn-primary btn-sm" on:click={() => push('/people/new')}>
    <i class="bi bi-person-plus me-1"></i> Add Person
  </button>
</div>

<div class="card mb-3">
  <div class="card-body">
    <form class="row g-2" on:submit|preventDefault={() => load(0)}>
      <div class="col-md-4"><input class="form-control form-control-sm" placeholder="Name" bind:value={filters.name} /></div>
      <div class="col-md-4"><input class="form-control form-control-sm" placeholder="Company" bind:value={filters.companyName} /></div>
      <div class="col-md-3">
        <select class="form-select form-select-sm" bind:value={filters.type}>
          <option value="">All Types</option>
          <option value="CUSTOMER">Customer</option>
          <option value="SUPPLIER">Supplier</option>
          <option value="BOTH">Both</option>
        </select>
      </div>
      <div class="col-md-1"><button type="submit" class="btn btn-primary btn-sm w-100">Go</button></div>
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
          <tr><th>#</th><th>Name / Company</th><th>Type</th><th>Contact</th><th class="text-end">Balance</th><th></th></tr>
        </thead>
        <tbody>
          {#each page.content as person, i}
            <tr>
              <td class="text-muted">{currentPage * 20 + i + 1}</td>
              <td>
                <div class="fw-medium">{person.name}</div>
                <small class="text-muted">{person.companyName}</small>
              </td>
              <td><span class="badge rounded-pill {peopleTypeBadgeClass(person.type)}">{person.type}</span></td>
              <td>{person.contactNoList?.[0]?.no ?? '—'}</td>
              <td class="text-end">{formatAmount(person.balance)}</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary me-1" on:click={() => push(`/people/${person.id}`)}>
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-primary" on:click={() => push(`/people/${person.id}/edit`)}>
                  <i class="bi bi-pencil"></i>
                </button>
              </td>
            </tr>
          {:else}
            <tr><td colspan="6" class="text-center text-muted py-4">No people found</td></tr>
          {/each}
        </tbody>
      </table>
      <div class="d-flex justify-content-between align-items-center p-3">
        <small class="text-muted">{page.totalElements} record(s)</small>
        <Pagination {page} onPageChange={load} />
      </div>
    {/if}
  </div>
</div>
