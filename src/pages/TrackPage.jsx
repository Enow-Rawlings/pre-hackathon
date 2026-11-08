/**
 * TrackPage — "/track" and "/track/:reference"
 * Lookup form + result card with progress tracker, photo modal, skeleton loading.
 */
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getReportByReference } from '../services/reportService'
import { CATEGORIES } from '../constants'
import { formatDate } from '../utils/formatDate'
import StatusBadge     from '../components/StatusBadge'
import ProgressTracker from '../components/ProgressTracker'
import Modal           from '../components/Modal'
import { ReportCardSkeleton } from '../components/Skeleton'
import Button from '../components/Button'
import Input  from '../components/Input'

export default function TrackPage() {
  const { reference: urlRef } = useParams()
  const navigate = useNavigate()

  const [query,     setQuery]     = useState(urlRef ?? '')
  const [report,    setReport]    = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [notFound,  setNotFound]  = useState(false)
  const [searched,  setSearched]  = useState(false)
  const [modalImg,  setModalImg]  = useState(null)  // { url } | null
  const inputRef = useRef(null)

  // Auto-load when a reference is in the URL
  useEffect(() => {
    if (urlRef) doSearch(urlRef)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlRef])

  const normalise = (val) => val.trim().toUpperCase().replace(/\s+/g, '-')

  const doSearch = async (raw) => {
    const ref = normalise(raw)
    if (!ref) return

    setLoading(true)
    setNotFound(false)
    setReport(null)
    setSearched(true)

    try {
      const result = await getReportByReference(ref)
      if (result) {
        setReport(result)
        // Update URL so the result is shareable
        navigate(`/track/${ref}`, { replace: true })
      } else {
        setNotFound(true)
      }
    } catch (err) {
      console.error(err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    doSearch(query)
  }

  const categoryLabel = (val) =>
    CATEGORIES.find((c) => c.value === val)?.label ?? val

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Track a Report</h1>
        <p className="mt-1 text-slate-500">
          Enter your reference number to check the current status of your report.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
        <div className="flex-1">
          <Input
            id="ref-input"
            ref={inputRef}
            label=""
            placeholder="e.g. CF-2026-0001"
            value={query}
            aria-label="Reference number"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          loading={loading}
          disabled={loading || !query.trim()}
          className="self-start mt-0 shrink-0"
          aria-label="Check status"
        >
          Check
        </Button>
      </form>

      <p className="mt-2 text-xs text-slate-400">
        Tip: lowercase letters and extra spaces are accepted automatically.
      </p>

      {/* ── Loading skeleton ──────────────────────────────────────────────── */}
      {loading && (
        <div className="mt-8">
          <ReportCardSkeleton />
        </div>
      )}

      {/* ── Not found ─────────────────────────────────────────────────────── */}
      {!loading && notFound && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3" aria-hidden="true">🤔</div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Report not found</h2>
          <p className="text-sm text-slate-600 mb-1">
            We couldn't find a report matching <strong className="font-mono">{normalise(query)}</strong>.
          </p>
          <p className="text-sm text-slate-500">
            Double-check the reference number and try again. Reference numbers look like{' '}
            <span className="font-mono font-semibold">CF-2026-0001</span>.
          </p>
        </div>
      )}

      {/* ── Result card ───────────────────────────────────────────────────── */}
      {!loading && report && (
        <article
          aria-label={`Report ${report.reference}`}
          className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          {/* Card header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-700 text-white px-6 py-4">
            <div>
              <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Reference</p>
              <p className="text-xl font-extrabold font-mono tracking-wider">{report.reference}</p>
            </div>
            <StatusBadge status={report.status} />
          </div>

          <div className="p-6 space-y-5">
            {/* Progress tracker */}
            <ProgressTracker status={report.status} />

            {/* Details grid */}
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-slate-400 font-medium text-xs uppercase tracking-wide mb-0.5">Category</dt>
                <dd className="text-slate-800 font-semibold capitalize">
                  {CATEGORIES.find((c) => c.value === report.category)?.emoji}{' '}
                  {categoryLabel(report.category)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium text-xs uppercase tracking-wide mb-0.5">Location</dt>
                <dd className="text-slate-800">{report.location}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-400 font-medium text-xs uppercase tracking-wide mb-0.5">Description</dt>
                <dd className="text-slate-700 leading-relaxed">{report.description}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium text-xs uppercase tracking-wide mb-0.5">Date Submitted</dt>
                <dd className="text-slate-700">{formatDate(report.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-400 font-medium text-xs uppercase tracking-wide mb-0.5">Last Updated</dt>
                <dd className="text-slate-700">{formatDate(report.updatedAt)}</dd>
              </div>
            </dl>

            {/* Photo thumbnails */}
            {report.images?.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 font-medium mb-2">
                  Photos ({report.images.length})
                </p>
                <div className="flex flex-wrap gap-3">
                  {report.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setModalImg(img)}
                      aria-label={`View photo ${i + 1} full size`}
                      className="h-20 w-20 rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      <img
                        src={img.url}
                        alt={`Evidence photo ${i + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      )}

      {/* ── Empty state (before first search) ────────────────────────────── */}
      {!loading && !searched && (
        <div className="mt-12 text-center text-slate-400">
          <svg className="h-16 w-16 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm">Enter your reference number above to get started.</p>
          <p className="text-xs mt-1">
            Try <button type="button" onClick={() => { setQuery('CF-2026-0001'); doSearch('CF-2026-0001') }} className="text-blue-600 underline hover:no-underline focus-visible:outline-none">CF-2026-0001</button> as a demo.
          </p>
        </div>
      )}

      {/* ── Photo modal ───────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!modalImg}
        onClose={() => setModalImg(null)}
        title="Photo Evidence"
      >
        {modalImg && (
          <img
            src={modalImg.url}
            alt="Full-size evidence photo"
            className="w-full rounded-xl max-h-[70vh] object-contain"
          />
        )}
      </Modal>
    </main>
  )
}
