<script lang="ts">
  import { uiStore } from '../../stores/ui'

  const iconMap = { success: 'bi-check-circle-fill text-success', error: 'bi-x-circle-fill text-danger', warning: 'bi-exclamation-triangle-fill text-warning', info: 'bi-info-circle-fill text-info' }
</script>

<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
  {#each $uiStore.toasts as toast (toast.id)}
    <div class="toast show align-items-center mb-2" role="alert">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi {iconMap[toast.type]}"></i>
          {toast.message}
        </div>
        <button type="button" class="btn-close me-2 m-auto" on:click={() => uiStore.dismissToast(toast.id)}></button>
      </div>
    </div>
  {/each}
</div>
