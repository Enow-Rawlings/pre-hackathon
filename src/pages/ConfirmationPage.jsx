/**
 * ConfirmationPage — "/report/success/:reference"
 * Shows the reference number with copy functionality.
 */
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getReportByReference } from '../services/reportService'
import Button from '../components/Button'

export default function ConfirmationPage() {
  const { reference }  = useParams()
  const [report, setReport]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [copied, setCopied]     = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!reference) { setLoading(false); setNotFound(true); return }

    getReportByReference(reference)
      .then((r) => {
        if (r) setReport(r)
        else   setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [reference])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = reference
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" aria-label="Loading…" />
      </main>
    )
  }

  if (notFound) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Report not found</h1>
        <p className="text-slate-500 mb-8">
          We couldn't find a report with reference <strong>{reference}</strong>.
          <br />
          If you just submitted it, try refreshing. Otherwise check the reference number.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/track">
            <Button variant="secondary">Track a Report</Button>
          </Link>
          <Link to="/report">
            <Button>Submit a New Report</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Report Submitted!</h1>
        <p className="mt-2 text-slate-500">
          Your report has been received and assigned to the relevant team.
        </p>
      </div>

      {/* Reference number highlight box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6 text-center">
        <p className="text-sm font-medium text-blue-600 mb-1 uppercase tracking-wide">Your Reference Number</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span
            className="text-3xl sm:text-4xl font-extrabold text-blue-800 tracking-wider font-mono"
            aria-label={`Reference number: ${reference}`}
          >
            {reference}
          </span>
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy reference number'}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            {copied ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <p className="mt-3 text-sm text-blue-600">
          💡 Save this number to track your report's progress.
        </p>
      </div>

      {/* Report summary */}
      {report && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8 space-y-3 text-sm">
          <h2 className="font-semibold text-slate-700 text-base mb-3">Report Summary</h2>
          {[
            { label: 'Category',    value: report.category },
            { label: 'Location',    value: report.location },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-2">
              <span className="w-24 shrink-0 text-slate-400 font-medium">{label}</span>
              <span className="text-slate-700 capitalize">{value}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <span className="w-24 shrink-0 text-slate-400 font-medium">Description</span>
            <span className="text-slate-700 line-clamp-2">{report.description}</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={`/track/${reference}`} className="flex-1">
          <Button variant="primary" className="w-full">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Track This Report
          </Button>
        </Link>
        <Link to="/report" className="flex-1">
          <Button variant="secondary" className="w-full">
            Submit Another Report
          </Button>
        </Link>
      </div>
    </main>
  )
}
