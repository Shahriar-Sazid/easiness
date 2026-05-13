import { describe, it, expect } from 'vitest'
import {
  formatAmount,
  formatQuantity,
  formatDate,
  formatPeopleName,
  formatAccountName,
  txTypeBadgeClass,
  txTypeLabel,
  peopleTypeBadgeClass,
  placeholderIfEmpty,
  toDecimalString,
} from '../src/lib/format'

describe('formatAmount', () => {
  it('formats a positive decimal string', () => {
    expect(formatAmount('1234.56')).toContain('1,234.56')
  })
  it('returns — for undefined', () => {
    expect(formatAmount(undefined)).toBe('—')
  })
  it('returns — for empty string', () => {
    expect(formatAmount('')).toBe('—')
  })
  it('uses custom currency symbol', () => {
    expect(formatAmount('100', '$')).toContain('$')
  })
})

describe('formatQuantity', () => {
  it('formats integer', () => {
    expect(formatQuantity('100')).toBe('100')
  })
  it('formats decimal', () => {
    const r = formatQuantity('1.5')
    expect(r).toContain('1.5')
  })
  it('returns — for undefined', () => {
    expect(formatQuantity(undefined)).toBe('—')
  })
})

describe('formatDate', () => {
  it('formats a valid ISO date', () => {
    const r = formatDate('2024-01-15T00:00:00Z')
    expect(r).toContain('2024')
  })
  it('returns — for undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })
  it('returns — for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('—')
  })
})

describe('formatPeopleName', () => {
  it('combines name and company', () => {
    expect(formatPeopleName('John', 'Acme')).toBe('John (Acme)')
  })
  it('returns name only when no company', () => {
    expect(formatPeopleName('John', '')).toBe('John')
  })
  it('returns — for both empty', () => {
    expect(formatPeopleName('', '')).toBe('—')
  })
})

describe('formatAccountName', () => {
  it('combines name and no', () => {
    expect(formatAccountName('Main Cash', 'C001')).toBe('Main Cash [C001]')
  })
  it('returns no when name empty', () => {
    expect(formatAccountName('', 'C001')).toBe('C001')
  })
})

describe('txTypeBadgeClass', () => {
  it('returns income class', () => {
    expect(txTypeBadgeClass('INCOME')).toBe('badge-income')
  })
  it('returns expense class', () => {
    expect(txTypeBadgeClass('EXPENSE')).toBe('badge-expense')
  })
  it('returns transfer class', () => {
    expect(txTypeBadgeClass('BANK_TRANSFER')).toBe('badge-transfer')
  })
})

describe('txTypeLabel', () => {
  it('returns human readable labels', () => {
    expect(txTypeLabel('INCOME')).toBe('Income')
    expect(txTypeLabel('EXPENSE')).toBe('Expense')
    expect(txTypeLabel('BANK_TRANSFER')).toBe('Transfer')
  })
})

describe('peopleTypeBadgeClass', () => {
  it('returns correct classes', () => {
    expect(peopleTypeBadgeClass('CUSTOMER')).toBe('badge-customer')
    expect(peopleTypeBadgeClass('SUPPLIER')).toBe('badge-supplier')
    expect(peopleTypeBadgeClass('BOTH')).toBe('badge-both')
  })
})

describe('placeholderIfEmpty', () => {
  it('returns value when set', () => {
    expect(placeholderIfEmpty('hello')).toBe('hello')
  })
  it('returns — for null', () => {
    expect(placeholderIfEmpty(null)).toBe('—')
  })
  it('returns — for empty string', () => {
    expect(placeholderIfEmpty('')).toBe('—')
  })
  it('uses custom placeholder', () => {
    expect(placeholderIfEmpty('', 'N/A')).toBe('N/A')
  })
})

describe('toDecimalString', () => {
  it('converts number to string', () => {
    expect(toDecimalString(1.5)).toBe('1.5')
  })
  it('strips trailing zeros', () => {
    expect(toDecimalString(100)).toBe('100')
  })
})
