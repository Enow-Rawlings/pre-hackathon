/**
 * Toast — auto-dismissing notification with React context provider.
 * Usage:
 *   const { showToast } = useToast()
 *   showToast('Copied!', 'success')
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

const ICONS = {
  success: (
    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" />
    </svg>
  ),
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timerRef = useRef({})

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    timerRef.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-[100] flex flex-col gap-2 items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 text-sm font-medium text-slate-800 max-w-sm w-full animate-[slideInRight_0.2s_ease]"
          >
            {ICONS[t.type] ?? ICONS.info}
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
