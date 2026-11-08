/**
 * ProgressTracker — 3-step visual progress bar (Pending → In Progress → Resolved).
 */
import React from 'react'
import { PROGRESS_STEPS, STATUS_CONFIG } from '../constants'

export default function ProgressTracker({ status }) {
  const currentStep = STATUS_CONFIG[status]?.step ?? 0

  return (
    <div className="w-full" role="list" aria-label="Report progress">
      <div className="flex items-center">
        {PROGRESS_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isCurrent   = idx === currentStep
          const isLast      = idx === PROGRESS_STEPS.length - 1

          return (
            <React.Fragment key={step}>
              {/* Step node */}
              <div className="flex flex-col items-center" role="listitem" aria-current={isCurrent ? 'step' : undefined}>
                <div
                  className={`
                    h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-300
                    ${isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-slate-200 text-slate-400'
                    }
                  `}
                  aria-label={`Step ${idx + 1}: ${step}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-600' : 'text-slate-400'
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`flex-1 h-1 mx-1 mb-5 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-green-400' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
