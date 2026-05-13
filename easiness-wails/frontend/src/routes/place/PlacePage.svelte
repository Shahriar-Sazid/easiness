<script lang="ts">
  import { onMount } from 'svelte'
  import { GetAllPlaces, CreatePlace, UpdatePlace } from '../../wailsjs/go/main/App'
  import type { dto_PlaceResponse } from '../../wailsjs/go/models'
  import Modal from '../../components/shared/Modal.svelte'
  import { uiStore } from '../../stores/ui'
  import Spinner from '../../components/shared/Spinner.svelte'

  let places: dto_PlaceResponse[] = []
  let loading = false
  let showModal = false
  let editPlace: Partial<dto_PlaceResponse> = {}
  let submitting = false

  async function load() {
    loading = true
    try { places = await GetAllPlaces() } finally { loading = false }
  }

  onMount(load)

  async function save() {
    if (!editPlace.name?.trim()) { uiStore.error('Name is required'); return }
    submitting = true
    try {
      if (editPlace.id) { await UpdatePlace(editPlace as any); uiStore.success('Updated') }
      else { await CreatePlace(editPlace as any); uiStore.success('Created') }
      showModal = false; editPlace = {}
      await load()
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Save failed')
    } finally {
      submitting = false
    }
  }
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4>Places / Warehouses</h4>
  <button class="btn btn-primary btn-sm" on:click={() => { editPlace = {}; showModal = true }}>
    <i class="bi bi-plus-lg me-1"></i> Add Place
  </button>
</div>

{#if loading}
  <div class="text-center py-5"><Spinner /></div>
{:else}
  <div class="row g-3">
    {#each places as place}
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="fw-medium">{place.name}</div>
                <small class="text-muted">{place.address || '—'}</small>
              </div>
              <button class="btn btn-sm btn-link p-0" on:click={() => { editPlace = { ...place }; showModal = true }}>
                <i class="bi bi-pencil text-primary"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="col-12 text-center text-muted py-4">No places yet</div>
    {/each}
  </div>
{/if}

<Modal show={showModal} title={editPlace.id ? 'Edit Place' : 'New Place'} onClose={() => { showModal = false; editPlace = {} }}>
  <div class="mb-3">
    <label class="form-label">Name *</label>
    <input class="form-control" bind:value={editPlace.name} />
  </div>
  <div class="mb-3">
    <label class="form-label">Address</label>
    <textarea class="form-control" rows="2" bind:value={editPlace.address}></textarea>
  </div>
  <svelte:fragment slot="footer">
    <button class="btn btn-secondary btn-sm" on:click={() => { showModal = false }}>Cancel</button>
    <button class="btn btn-primary btn-sm" disabled={submitting} on:click={save}>
      {#if submitting}<Spinner size="sm" />{:else}Save{/if}
    </button>
  </svelte:fragment>
</Modal>
