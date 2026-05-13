<script lang="ts">
  import { authStore } from '../../stores/auth'
  import { syncStore } from '../../stores/sync'
  import type { dto_LicenseStatusResponse } from '../../wailsjs/go/models'

  export let licenseStatus: dto_LicenseStatusResponse | null = null

  function logout() {
    authStore.logout()
  }

  $: daysLeft = licenseStatus?.daysRemaining ?? 9999
  $: isExpiringSoon = daysLeft >= 0 && daysLeft <= 30
  $: licenseLabel = licenseStatus?.status === 'valid' ? `License: ${daysLeft}d left` : ''

  $: syncIcon = $syncStore.status === 'syncing'  ? 'bi-arrow-repeat spin'
              : $syncStore.status === 'error'    ? 'bi-exclamation-circle-fill text-danger'
              : $syncStore.status === 'offline'  ? 'bi-cloud-slash'
              : 'bi-cloud-check'

  $: syncTitle = $syncStore.status === 'syncing' ? 'Syncing…'
               : $syncStore.status === 'error'   ? `Sync error: ${$syncStore.error}`
               : $syncStore.status === 'offline' ? 'Offline — sync unavailable'
               : $syncStore.lastSyncAt           ? `Last synced ${$syncStore.lastSyncAt.toLocaleTimeString()}`
               : 'Not yet synced'

  $: hasPending = $syncStore.pendingPush > 0
</script>

<style>
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { display: inline-block; animation: spin 1s linear infinite; }
</style>

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

  <!-- Sync indicator -->
  <button
    class="btn btn-sm btn-outline-secondary me-2 position-relative"
    title={syncTitle}
    on:click={() => syncStore.sync()}
    disabled={$syncStore.status === 'syncing'}
  >
    <i class="bi {syncIcon}"></i>
    {#if hasPending}
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
            style="font-size:0.6rem;">
        {$syncStore.pendingPush}
      </span>
    {/if}
  </button>

  <div class="dropdown">
    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
      <i class="bi bi-person-circle me-1"></i> Admin
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li><button class="dropdown-item" on:click={logout}><i class="bi bi-box-arrow-right me-2"></i>Logout</button></li>
    </ul>
  </div>
</header>
