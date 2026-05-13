<script lang="ts">
  import { link, location } from 'svelte-spa-router'

  const navItems = [
    { path: '/', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/products', icon: 'bi-box-seam', label: 'Products' },
    { path: '/people', icon: 'bi-people', label: 'People' },
    { path: '/stock', icon: 'bi-archive', label: 'Stock' },
    { path: '/business/buy', icon: 'bi-cart-plus', label: 'Purchase' },
    { path: '/business/sell', icon: 'bi-receipt', label: 'Sales' },
    { path: '/accounting', icon: 'bi-bank', label: 'Accounting' },
    { path: '/places', icon: 'bi-geo-alt', label: 'Places' },
  ]

  $: currentPath = $location
</script>

<nav class="sidebar">
  <div class="sidebar-brand">
    <i class="bi bi-lightning-charge-fill text-warning me-2"></i>
    Easiness
  </div>
  <ul class="nav flex-column sidebar-nav py-2">
    {#each navItems as item}
      <li class="nav-item">
        <a
          href={item.path}
          use:link
          class="nav-link"
          class:active={currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))}
        >
          <i class="bi {item.icon}"></i>
          {item.label}
        </a>
      </li>
    {/each}
  </ul>
</nav>
