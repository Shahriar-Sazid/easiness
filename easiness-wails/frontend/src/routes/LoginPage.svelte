<script lang="ts">
  import { authStore } from '../stores/auth'
  import Spinner from '../components/shared/Spinner.svelte'

  let password = ''
  let submitting = false
  let error = ''

  async function handleLogin() {
    if (!password.trim()) { error = 'Password is required'; return }
    submitting = true
    error = ''
    const ok = await authStore.login(password)
    if (!ok) error = 'Incorrect password'
    submitting = false
  }
</script>

<div class="d-flex justify-content-center align-items-center" style="height:100vh;background:#f5f7fb">
  <div class="card shadow" style="width:380px">
    <div class="card-body p-5">
      <div class="text-center mb-4">
        <i class="bi bi-lightning-charge-fill text-primary" style="font-size:2.5rem"></i>
        <h4 class="mt-2 fw-bold">Easiness</h4>
        <p class="text-muted small">Business Management</p>
      </div>

      <form on:submit|preventDefault={handleLogin}>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            class:is-invalid={!!error}
            bind:value={password}
            placeholder="Enter password"
            autofocus
          />
          {#if error}<div class="invalid-feedback">{error}</div>{/if}
        </div>
        <button type="submit" class="btn btn-primary w-100" disabled={submitting}>
          {#if submitting}<Spinner size="sm" />{:else}Login{/if}
        </button>
      </form>
    </div>
  </div>
</div>
