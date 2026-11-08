/**
 * Input — labelled text input with inline error support.
 */
import React from 'react'

export default function Input({
  id,
  label,
  error,
  hint,
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
      <input
        id={id}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={!!error}
        required={required}
        className={
          `w-full rounded-xl border px-4 py-3 text-base text-slate-900 bg-white ` +
          `placeholder:text-slate-400 ` +
          `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ` +
          `transition-colors ` +
          (error
            ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400 '
            : 'border-slate-300 hover:border-slate-400 ') +
          className
        }
        {...props}
      />
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
