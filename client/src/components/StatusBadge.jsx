/**
 * StatusBadge — coloured pill for Pending / In Progress / Resolved.
 */
import React from 'react'
import { STATUS_CONFIG } from '../constants'

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status]
  if (!config) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.badgeClass}`}
      aria-label={`Status: ${config.label}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dotClass}`} aria-hidden="true" />
      {config.label}
    </span>
  )
}
