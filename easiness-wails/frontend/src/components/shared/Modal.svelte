<script lang="ts">
  export let show = false
  export let title = ''
  export let size: '' | 'sm' | 'lg' | 'xl' = ''
  export let onClose: () => void = () => {}
</script>

{#if show}
  <div class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,.5)">
    <div class="modal-dialog modal-dialog-centered {size ? 'modal-' + size : ''}">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{title}</h5>
          <button type="button" class="btn-close" on:click={onClose}></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
{/if}
