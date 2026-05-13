<script lang="ts">
  import { authStore } from '../stores/auth'
  import Spinner from '../components/shared/Spinner.svelte'

  let password = ''
  let confirm = ''
  let submitting = false
  let error = ''

  async function handleSetup() {
    if (!password.trim()) { error = 'Password is required'; return }
    if (password.length < 6) { error = 'Minimum 6 characters'; return }
    if (password !== confirm) { error = 'Passwords do not match'; return }
    submitting = true
    error = ''
    try {
      await authStore.setup(password)
    } catch (e: any) {
      error = e?.message ?? 'Setup failed'
    }
    submitting = false
  }
</script>

<div class="d-flex justify-content-center align-items-center" style="height:100vh;background:#f5f7fb">
  <div class="card shadow" style="width:400px">
    <div class="card-body p-5">
      <div class="text-center mb-4">
        <i class="bi bi-shield-lock text-primary" style="font-size:2.5rem"></i>
        <h4 class="mt-2 fw-bold">First Time Setup</h4>
        <p class="text-muted small">Create a password to protect your data</p>
      </div>

      <form on:submit|preventDefault={handleSetup}>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" class:is-invalid={!!error} bind:value={password} />
        </div>
        <div class="mb-3">
          <label class="form-label">Confirm Password</label>
          <input type="password" class="form-control" class:is-invalid={!!error} bind:value={confirm} />
          {#if error}<div class="invalid-feedback">{error}</div>{/if}
        </div>
        <button type="submit" class="btn btn-primary w-100" disabled={submitting}>
          {#if submitting}<Spinner size="sm" />{:else}Create Password{/if}
        </button>
      </form>
    </div>
  </div>
</div>
