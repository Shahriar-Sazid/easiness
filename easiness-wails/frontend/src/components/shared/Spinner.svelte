<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md'
  const classes = { sm: 'spinner-border-sm', md: '', lg: 'spinner-border-lg' }
</script>

<div class="spinner-border text-primary {classes[size]}" role="status" style={size === 'lg' ? 'width:3rem;height:3rem' : ''}>
  <span class="visually-hidden">Loading…</span>
</div>
