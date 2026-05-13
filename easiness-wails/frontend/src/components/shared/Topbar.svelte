<script lang="ts">
  import { authStore } from '../../stores/auth'
  import { uiStore } from '../../stores/ui'

  function logout() {
    authStore.logout()
  }
</script>

<header class="topbar">
  <div class="flex-grow-1"></div>
  <div class="dropdown">
    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
      <i class="bi bi-person-circle me-1"></i> Admin
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li><button class="dropdown-item" on:click={logout}><i class="bi bi-box-arrow-right me-2"></i>Logout</button></li>
    </ul>
  </div>
</header>
