<script lang="ts">
  import { onMount } from 'svelte'
  import { push, params } from 'svelte-spa-router'
  import { CreateProduct, UpdateProduct, SearchProduct } from '../../wailsjs/go/main/App'
  import { unitsStore } from '../../stores/units'
  import { uiStore } from '../../stores/ui'
  import Spinner from '../../components/shared/Spinner.svelte'

  $: id = $params?.id ? parseInt($params.id) : 0
  let isEdit = false

  let form = { id: 0, name: '', type: '', brand: '', country: '', size: '', preferredUnit: 1 }
  let submitting = false
  let errors: Record<string, string> = {}

  onMount(async () => {
    if (id) {
      isEdit = true
      const page = await SearchProduct({ page: 0, size: 1, name: '' })
      // In real app, we'd have a GetProductById endpoint.
      // For now, searching and finding by id.
      const product = page.content.find(p => p.id === id)
      if (product) {
        form = { id: product.id, name: product.name, type: product.type, brand: product.brand, country: product.country, size: product.size, preferredUnit: product.preferredUnit }
      }
    }
  })

  function validate(): boolean {
    errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.country.trim()) errors.country = 'Country is required'
    if (!form.preferredUnit) errors.preferredUnit = 'Unit is required'
    return Object.keys(errors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    submitting = true
    try {
      if (isEdit) {
        await UpdateProduct(form)
        uiStore.success('Product updated')
      } else {
        await CreateProduct(form)
        uiStore.success('Product created')
        push('/products')
      }
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Failed to save product')
    } finally {
      submitting = false
    }
  }
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4 class="mb-0">{isEdit ? 'Edit' : 'New'} Product</h4>
  <button class="btn btn-outline-secondary btn-sm" on:click={() => push('/products')}>
    <i class="bi bi-arrow-left me-1"></i> Back
  </button>
</div>

<div class="card" style="max-width:600px">
  <div class="card-body">
    <form on:submit|preventDefault={handleSubmit}>
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label">Name *</label>
          <input class="form-control" class:is-invalid={!!errors.name} bind:value={form.name} />
          {#if errors.name}<div class="invalid-feedback">{errors.name}</div>{/if}
        </div>
        <div class="col-md-6">
          <label class="form-label">Type</label>
          <input class="form-control" bind:value={form.type} placeholder="e.g. Clothing, Electronics" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Brand</label>
          <input class="form-control" bind:value={form.brand} />
        </div>
        <div class="col-md-6">
          <label class="form-label">Country *</label>
          <input class="form-control" class:is-invalid={!!errors.country} bind:value={form.country} />
          {#if errors.country}<div class="invalid-feedback">{errors.country}</div>{/if}
        </div>
        <div class="col-md-6">
          <label class="form-label">Size</label>
          <input class="form-control" bind:value={form.size} placeholder="S, M, L, XL, etc." />
        </div>
        <div class="col-md-6">
          <label class="form-label">Preferred Unit *</label>
          <select class="form-select" class:is-invalid={!!errors.preferredUnit} bind:value={form.preferredUnit}>
            {#each $unitsStore.units as unit}
              <option value={unit.id}>{unit.name}</option>
            {/each}
          </select>
          {#if errors.preferredUnit}<div class="invalid-feedback">{errors.preferredUnit}</div>{/if}
        </div>
      </div>
      <div class="mt-4 d-flex gap-2">
        <button type="submit" class="btn btn-primary" disabled={submitting}>
          {#if submitting}<Spinner size="sm" />{:else}{isEdit ? 'Update' : 'Create'}{/if}
        </button>
        <button type="button" class="btn btn-outline-secondary" on:click={() => push('/products')}>Cancel</button>
      </div>
    </form>
  </div>
</div>
