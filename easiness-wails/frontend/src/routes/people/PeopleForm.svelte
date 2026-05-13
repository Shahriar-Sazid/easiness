<script lang="ts">
  import { onMount } from 'svelte'
  import { push, params } from 'svelte-spa-router'
  import { CreatePeople, UpdatePeople, GetPeopleDetails } from '../../wailsjs/go/main/App'
  import type { dto_ContactNoDTO } from '../../wailsjs/go/models'
  import { uiStore } from '../../stores/ui'
  import Spinner from '../../components/shared/Spinner.svelte'

  $: id = $params?.id ? parseInt($params.id) : 0
  let isEdit = false

  let form = { id: 0, name: '', companyName: '', address: '', type: 'CUSTOMER', email: '', contactNoList: [] as dto_ContactNoDTO[] }
  let submitting = false
  let errors: Record<string, string> = {}

  onMount(async () => {
    if (id) {
      isEdit = true
      try {
        const details = await GetPeopleDetails(id)
        const p = details.people
        form = { id: p.id, name: p.name, companyName: p.companyName, address: p.address, type: p.type, email: p.email, contactNoList: [...p.contactNoList] }
      } catch (e: any) {
        uiStore.error('Person not found')
        push('/people')
      }
    }
  })

  function addContact() {
    form.contactNoList = [...form.contactNoList, { no: '' }]
  }

  function removeContact(i: number) {
    form.contactNoList = form.contactNoList.filter((_, idx) => idx !== i)
  }

  function validate(): boolean {
    errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.companyName.trim()) errors.companyName = 'Company name is required'
    return Object.keys(errors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    submitting = true
    try {
      if (isEdit) {
        await UpdatePeople(form)
        uiStore.success('Updated successfully')
      } else {
        await CreatePeople(form)
        uiStore.success('Created successfully')
        push('/people')
      }
    } catch (e: any) {
      uiStore.error(e?.message ?? 'Save failed')
    } finally {
      submitting = false
    }
  }
</script>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h4>{isEdit ? 'Edit' : 'New'} Person</h4>
  <button class="btn btn-outline-secondary btn-sm" on:click={() => push('/people')}><i class="bi bi-arrow-left me-1"></i> Back</button>
</div>

<div class="card" style="max-width:640px">
  <div class="card-body">
    <form on:submit|preventDefault={handleSubmit}>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Name *</label>
          <input class="form-control" class:is-invalid={!!errors.name} bind:value={form.name} />
          {#if errors.name}<div class="invalid-feedback">{errors.name}</div>{/if}
        </div>
        <div class="col-md-6">
          <label class="form-label">Company Name *</label>
          <input class="form-control" class:is-invalid={!!errors.companyName} bind:value={form.companyName} />
          {#if errors.companyName}<div class="invalid-feedback">{errors.companyName}</div>{/if}
        </div>
        <div class="col-md-6">
          <label class="form-label">Type *</label>
          <select class="form-select" bind:value={form.type}>
            <option value="CUSTOMER">Customer</option>
            <option value="SUPPLIER">Supplier</option>
            <option value="BOTH">Both</option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" bind:value={form.email} />
        </div>
        <div class="col-12">
          <label class="form-label">Address</label>
          <textarea class="form-control" rows="2" bind:value={form.address}></textarea>
        </div>

        <!-- Contact Numbers -->
        <div class="col-12">
          <div class="d-flex justify-content-between mb-2">
            <label class="form-label mb-0">Contact Numbers</label>
            <button type="button" class="btn btn-sm btn-outline-secondary" on:click={addContact}>
              <i class="bi bi-plus"></i> Add
            </button>
          </div>
          {#each form.contactNoList as contact, i}
            <div class="input-group mb-2">
              <input class="form-control form-control-sm" bind:value={contact.no} placeholder="Phone number" />
              <button type="button" class="btn btn-sm btn-outline-danger" on:click={() => removeContact(i)}>
                <i class="bi bi-trash"></i>
              </button>
            </div>
          {/each}
        </div>
      </div>

      <div class="mt-4 d-flex gap-2">
        <button type="submit" class="btn btn-primary" disabled={submitting}>
          {#if submitting}<Spinner size="sm" />{:else}{isEdit ? 'Update' : 'Create'}{/if}
        </button>
        <button type="button" class="btn btn-outline-secondary" on:click={() => push('/people')}>Cancel</button>
      </div>
    </form>
  </div>
</div>
