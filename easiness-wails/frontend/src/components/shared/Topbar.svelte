<script lang="ts">
  import { authStore } from '../../stores/auth'
  import type { dto_LicenseStatusResponse } from '../../wailsjs/go/models'

  export let licenseStatus: dto_LicenseStatusResponse | null = null

  function logout() {
    authStore.logout()
  }

  $: daysLeft = licenseStatus?.daysRemaining ?? 9999
  $: isExpiringSoon = daysLeft >= 0 && daysLeft <= 30
  $: licenseLabel = licenseStatus?.status === 'valid'
    ? `License: ${daysLeft}d left`
    : ''
</script>

<header class="topbar">
  <div class="flex-grow-1"></div>

  <!-- License expiry warning (shown when ≤ 30 days remain) -->
  {#if licenseStatus?.status === 'valid' && isExpiringSoon}
    <span
      class="badge me-3 {daysLeft <= 7 ? 'bg-danger' : 'bg-warning text-dark'}"
      title="Your license expires in {daysLeft} day{daysLeft === 1 ? '' : 's'}"
    >
      <i class="bi bi-shield-exclamation me-1"></i>{licenseLabel}
    </span>
  {/if}

  <div class="dropdown">
    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
      <i class="bi bi-person-circle me-1"></i> Admin
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li><button class="dropdown-item" on:click={logout}><i class="bi bi-box-arrow-right me-2"></i>Logout</button></li>
    </ul>
  </div>
</header>
