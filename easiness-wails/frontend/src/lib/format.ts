// Format utilities replacing Angular pipes.

export function formatAmount(value: string | number | undefined, currencySymbol = '৳'): string {
  if (value == null || value === '') return '—'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '—'
  return `${currencySymbol} ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatQuantity(value: string | number | undefined): string {
  if (value == null || value === '') return '—'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '—'
  return num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 4 })
}

export function formatDate(value: string | Date | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(value: string | Date | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatPeopleName(name: string, company: string): string {
  if (!name && !company) return '—'
  if (!company) return name
  if (!name) return company
  return `${name} (${company})`
}

export function formatAccountName(name: string, no: string): string {
  if (!name) return no || '—'
  return `${name} [${no}]`
}

export function txTypeBadgeClass(type: string): string {
  switch (type) {
    case 'INCOME': return 'badge-income'
    case 'EXPENSE': return 'badge-expense'
    case 'BANK_TRANSFER': return 'badge-transfer'
    default: return 'bg-secondary'
  }
}

export function txTypeLabel(type: string): string {
  switch (type) {
    case 'INCOME': return 'Income'
    case 'EXPENSE': return 'Expense'
    case 'BANK_TRANSFER': return 'Transfer'
    default: return type
  }
}

export function peopleTypeBadgeClass(type: string): string {
  switch (type) {
    case 'CUSTOMER': return 'badge-customer'
    case 'SUPPLIER': return 'badge-supplier'
    case 'BOTH': return 'badge-both'
    default: return 'bg-secondary'
  }
}

export function placeholderIfEmpty(value: string | undefined | null, placeholder = '—'): string {
  if (!value || value.trim() === '') return placeholder
  return value
}

export function toDecimalString(value: number | string): string {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(n)) return '0'
  return n.toFixed(6).replace(/\.?0+$/, '')
}
