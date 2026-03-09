import { parseLocalDate } from '@/lib/date'

export function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(Number(value) || 0)
}

export function formatCompactCurrency(value) {
  return formatCurrency(value).replace(',00', '')
}

export function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

export function formatDateDisplay(value) {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parseLocalDate(value))
}
