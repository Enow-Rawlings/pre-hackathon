/**
 * Skeleton — animated loading placeholder blocks.
 */
import React from 'react'

/** Single shimmer bar */
export function SkeletonLine({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-slate-200 rounded-lg animate-pulse ${className}`}
    />
  )
}

/** Full report card skeleton shown while fetching a report */
export function ReportCardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading report…" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <SkeletonLine className="h-6 w-36" />
        <SkeletonLine className="h-7 w-24 rounded-full" />
      </div>
      <div className="space-y-2">
        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="h-5 w-48" />
      </div>
      <div className="space-y-2">
        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="h-5 w-64" />
      </div>
      <div className="space-y-2">
        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="h-16 w-full" />
      </div>
      <SkeletonLine className="h-14 w-full rounded-xl" />
    </div>
  )
}

export default SkeletonLine
