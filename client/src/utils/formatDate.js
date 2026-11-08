/**
 * Format an ISO date string into a human-friendly form.
 * e.g. "8 Nov 2026, 14:35"
 */
export function formatDate(isoString) {
  if (!isoString) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day:    'numeric',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString))
}
