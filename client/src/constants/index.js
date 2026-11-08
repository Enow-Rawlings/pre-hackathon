/**
 * Central constants for CampusFix.
 * Both the public-facing app and the future admin module import from here.
 */

// ─── Report categories ────────────────────────────────────────────────────────
export const CATEGORIES = [
  { value: 'electrical',  label: 'Electrical',     emoji: '⚡' },
  { value: 'plumbing',    label: 'Plumbing',        emoji: '🔧' },
  { value: 'internet',    label: 'Internet / Wi-Fi', emoji: '📶' },
  { value: 'security',    label: 'Security',        emoji: '🔒' },
  { value: 'cleanliness', label: 'Cleanliness',     emoji: '🧹' },
  { value: 'furniture',   label: 'Furniture',       emoji: '🪑' },
  { value: 'other',       label: 'Other',           emoji: '📋' },
]

// ─── Report statuses ──────────────────────────────────────────────────────────
export const STATUSES = {
  PENDING:     'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED:    'Resolved',
}

// Status display config (colour + label) — used by StatusBadge & ProgressTracker
export const STATUS_CONFIG = {
  [STATUSES.PENDING]: {
    label: 'Pending',
    badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
    dotClass:   'bg-amber-500',
    step: 0,
  },
  [STATUSES.IN_PROGRESS]: {
    label: 'In Progress',
    badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200',
    dotClass:   'bg-blue-500',
    step: 1,
  },
  [STATUSES.RESOLVED]: {
    label: 'Resolved',
    badgeClass: 'bg-green-100 text-green-800 border border-green-200',
    dotClass:   'bg-green-500',
    step: 2,
  },
}

// Progress tracker steps (in order)
export const PROGRESS_STEPS = [
  STATUSES.PENDING,
  STATUSES.IN_PROGRESS,
  STATUSES.RESOLVED,
]

// LocalStorage key for reports
export const LS_KEY = 'campusfix_reports'
// LocalStorage key for the sequence counter
export const LS_SEQ_KEY = 'campusfix_seq'
