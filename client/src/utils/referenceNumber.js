/**
 * Reference number utilities.
 * Format: CF-<YEAR>-<ZERO-PADDED-SEQUENCE>  e.g. CF-2026-0001
 */

import { LS_SEQ_KEY, LS_KEY } from '../constants'

/**
 * Read all existing reference numbers from storage and return as a Set.
 */
function getExistingRefs() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return new Set()
    const reports = JSON.parse(raw)
    return new Set(reports.map((r) => r.reference))
  } catch {
    return new Set()
  }
}

/**
 * Generate the next unique reference number.
 * Persists the sequence counter to localStorage so it survives reloads.
 */
export function generateReference() {
  const year = new Date().getFullYear()
  const existing = getExistingRefs()

  let seq = parseInt(localStorage.getItem(LS_SEQ_KEY) || '0', 10)

  let ref
  // Keep incrementing until we get a unique value (handles gaps/deletions)
  do {
    seq += 1
    ref = `CF-${year}-${String(seq).padStart(4, '0')}`
  } while (existing.has(ref))

  localStorage.setItem(LS_SEQ_KEY, String(seq))
  return ref
}
