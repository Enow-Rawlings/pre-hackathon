/**
 * NotFoundPage — 404 catch-all.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function NotFoundPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-8xl font-extrabold text-blue-100 select-none" aria-hidden="true">404</p>
      <div className="text-5xl mb-4" aria-hidden="true">🏗️</div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h1>
      <p className="text-slate-500 max-w-sm mb-8">
        This page doesn't exist or may have been moved. Let's get you back on track.
      </p>
      <Link to="/">
        <Button size="lg">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Button>
      </Link>
    </main>
  )
}
