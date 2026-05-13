<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { ActivateLicense } from '../../wailsjs/go/main/App'
  import type { dto_LicenseStatusResponse } from '../../wailsjs/go/models'
  import Spinner from '../../components/shared/Spinner.svelte'

  export let currentStatus: dto_LicenseStatusResponse | null = null

  const dispatch = createEventDispatcher<{ activated: dto_LicenseStatusResponse }>()

  let keyInput = ''
  let isSubmitting = false
  let errorMsg = ''
  let successMsg = ''

  const isExpired = currentStatus?.status === 'expired'

  async function activate() {
    const key = keyInput.trim()
    if (!key) return

    isSubmitting = true
    errorMsg = ''
    successMsg = ''

    try {
      const result = await ActivateLicense({ key })
      successMsg = result.status === 'expired'
        ? 'Key accepted but it has already expired.'
        : 'License activated successfully!'
      keyInput = ''
      dispatch('activated', result)
    } catch (err: any) {
      const code = err?.code ?? ''
      if (code === 'INVALID_LICENSE_KEY') {
        errorMsg = 'This license key is invalid or has been tampered with.'
      } else {
        errorMsg = err?.message ?? 'Activation failed. Please try again.'
      }
    } finally {
      isSubmitting = false
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') activate()
  }
</script>

<div class="license-page d-flex flex-column align-items-center justify-content-center" style="min-height:100vh; background:#f8f9fa;">
  <div class="card shadow-sm" style="width:100%;max-width:520px;">
    <div class="card-body p-4">

      <!-- Header -->
      <div class="text-center mb-4">
        <i class="bi bi-shield-lock" style="font-size:3rem; color:#0d6efd;"></i>
        <h4 class="mt-2 mb-0">Easiness License</h4>
        {#if isExpired}
          <span class="badge bg-danger mt-1">License Expired</span>
        {:else}
          <span class="badge bg-warning text-dark mt-1">No Active License</span>
        {/if}
      </div>

      <!-- Current status if expired -->
      {#if isExpired && currentStatus}
        <div class="alert alert-warning d-flex align-items-start gap-2 mb-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill flex-shrink-0 mt-1"></i>
          <div>
            <strong>Your license expired</strong> on {new Date(currentStatus.expiresAt).toLocaleDateString()}.<br>
            Please enter a new license key to continue using Easiness.
          </div>
        </div>
      {:else}
        <p class="text-muted text-center small mb-3">
          Enter your license key to activate Easiness. Keys are available from the Easiness marketplace.
        </p>
      {/if}

      <!-- Activation form -->
      <div class="mb-3">
        <label for="license-key" class="form-label fw-semibold">License Key</label>
        <input
          id="license-key"
          type="text"
          class="form-control font-monospace"
          class:is-invalid={!!errorMsg}
          class:is-valid={!!successMsg}
          placeholder="EASINESS-eyJ..."
          bind:value={keyInput}
          on:keydown={handleKeydown}
          disabled={isSubmitting}
          autocomplete="off"
          spellcheck="false"
        />
        {#if errorMsg}
          <div class="invalid-feedback">{errorMsg}</div>
        {/if}
        {#if successMsg}
          <div class="valid-feedback">{successMsg}</div>
        {/if}
      </div>

      <button
        class="btn btn-primary w-100"
        on:click={activate}
        disabled={isSubmitting || !keyInput.trim()}
      >
        {#if isSubmitting}
          <Spinner size="sm" /> Activating…
        {:else}
          Activate License
        {/if}
      </button>

      <!-- Help text -->
      <p class="text-muted text-center small mt-3 mb-0">
        Need a license? Visit the
        <a href="https://easiness.app" target="_blank" rel="noreferrer">Easiness marketplace</a>.
      </p>

    </div>
  </div>
</div>
