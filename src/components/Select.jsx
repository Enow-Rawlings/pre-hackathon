/**
 * Select — labelled dropdown with error support.
 */
import React from 'react'

export default function Select({
  id,
  label,
  error,
  hint,
  options = [],
  placeholder = 'Select an option',
  className = '',
  required,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={!!error}
          required={required}
          className={
            `w-full rounded-xl border px-4 py-3 text-base bg-white appearance-none cursor-pointer ` +
            `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ` +
            `transition-colors pr-10 ` +
            (error
              ? 'border-red-400 bg-red-50 text-slate-900 '
              : 'border-slate-300 hover:border-slate-400 text-slate-900 ') +
            (!props.value ? 'text-slate-400 ' : '') +
            className
          }
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.emoji ? `${opt.emoji}  ${opt.label}` : opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  )
}
