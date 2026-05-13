<script lang="ts">
  import type { dto_Page } from '../../wailsjs/go/models'

  export let page: dto_Page<any>
  export let onPageChange: (n: number) => void = () => {}

  $: current = page?.number ?? 0
  $: total = page?.totalPages ?? 0
  $: pages = Array.from({ length: total }, (_, i) => i)
</script>

{#if total > 1}
  <nav>
    <ul class="pagination pagination-sm mb-0">
      <li class="page-item" class:disabled={current === 0}>
        <button class="page-link" on:click={() => onPageChange(current - 1)}>&laquo;</button>
      </li>
      {#each pages as p}
        {#if Math.abs(p - current) <= 2 || p === 0 || p === total - 1}
          <li class="page-item" class:active={p === current}>
            <button class="page-link" on:click={() => onPageChange(p)}>{p + 1}</button>
          </li>
        {:else if Math.abs(p - current) === 3}
          <li class="page-item disabled"><span class="page-link">…</span></li>
        {/if}
      {/each}
      <li class="page-item" class:disabled={current >= total - 1}>
        <button class="page-link" on:click={() => onPageChange(current + 1)}>&raquo;</button>
      </li>
    </ul>
  </nav>
{/if}
