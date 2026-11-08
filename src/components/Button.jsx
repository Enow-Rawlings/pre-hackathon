/**
 * Button — primary, secondary, ghost, and danger variants.
 * Large tap targets (min-h-12) for mobile.
 */
import React from 'react'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold ' +
  'min-h-12 px-6 py-3 text-base cursor-pointer select-none ' +
  'transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

const VARIANTS = {
  primary:
    'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 ' +
    'focus-visible:outline-blue-700 shadow-sm',
  secondary:
    'bg-white text-blue-700 border-2 border-blue-700 hover:bg-blue-50 ' +
    'active:bg-blue-100 focus-visible:outline-blue-700',
  teal:
    'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 ' +
    'focus-visible:outline-teal-600 shadow-sm',
  ghost:
    'bg-transparent text-blue-700 hover:bg-blue-50 active:bg-blue-100 ' +
    'focus-visible:outline-blue-700',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 ' +
    'focus-visible:outline-red-600',
}

const SIZES = {
  sm: 'min-h-9 px-4 py-2 text-sm',
  md: '',             // default — BASE already defines this
  lg: 'min-h-14 px-8 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size    = 'md',
  loading = false,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
