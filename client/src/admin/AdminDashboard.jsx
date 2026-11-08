/**
 * AdminDashboard — /admin
 * Lists all reports, lets admin filter by status/category and update status.
 */
import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from './useAdminAuth'
import { CATEGORIES, STATUS_CONFIG, STATUSES } from '../constants'
import { formatDate } from '../utils/formatDate'

const API_BASE    = import.meta.env.VITE_API_URL
const VALID_STATUSES = Object.values(STATUSES) // ['Pending','In Progress','Resolved']

// ─── tiny fetch wrapper ───────────────────────────────────────────────────────
async function adminFetch(path, options = {}) {
  const token = localStorage.getItem('campusfix_token')
  const res   = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error ${res.status}`)
  }
  return res.json()
}

// ─── status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {}
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.badgeClass || 'bg-slate-100 text-slate-600'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass || 'bg-slate-400'}`} aria-hidden="true" />
      {status}
    </span>
  )
}

// ─── status select pill ───────────────────────────────────────────────────────
function StatusSelect({ reportId, current, onUpdated }) {
  const [saving, setSaving] = useState(false)
  const [value,  setValue]  = useState(current)

  const handleChange = async (e) => {
    const next = e.target.value
    setValue(next)
    setSaving(true)
    try {
      await adminFetch(`/api/reports/${reportId}/status`, {
        method: 'PATCH',
        body:   JSON.stringify({ status: next }),
      })
      onUpdated(reportId, next)
    } catch {
      setValue(current) // revert on failure
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={handleChange}
        disabled={saving}
        className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 cursor-pointer"
        aria-label="Update report status"
      >
        {VALID_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {saving && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          <svg className="h-3.5 w-3.5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </span>
      )}
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout }           = useAdminAuth()
  const navigate                   = useNavigate()
  const [reports,    setReports]   = useState([])
  const [pagination, setPagination]= useState(null)
  const [loading,    setLoading]   = useState(true)
  const [error,      setError]     = useState(null)
  const [expanded,   setExpanded]  = useState(null) // expanded row id

  // filters
  const [filterStatus,   setFilterStatus]   = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [page, setPage]                      = useState(1)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (filterStatus)   params.set('status',   filterStatus)
      if (filterCategory) params.set('category', filterCategory)

      const data = await adminFetch(`/api/reports?${params}`)
      setReports(data.reports || [])
      setPagination(data.pagination || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterStatus, filterCategory, page])

  useEffect(() => { fetchReports() }, [fetchReports])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [filterStatus, filterCategory])

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const handleStatusUpdated = (id, newStatus) => {
    setReports((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: newStatus } : r)
    )
  }

  const categoryLabel = (val) =>
    CATEGORIES.find((c) => c.value === val)?.label ?? val

  // Summary counts from current page
  const counts = VALID_STATUSES.reduce((acc, s) => {
    acc[s] = reports.filter((r) => r.status === s).length
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white font-extrabold text-sm">CF</span>
            <span className="font-bold text-blue-800 text-lg">CampusFix</span>
            <span className="hidden sm:block text-slate-300 mx-1">|</span>
            <span className="hidden sm:block text-sm font-semibold text-slate-500">Admin Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-slate-500">
              Signed in as <strong className="text-slate-700">{user?.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Page heading ───────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review submitted reports and update their status.
          </p>
        </div>

        {/* ── Status summary cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {VALID_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s]
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
                className={`rounded-2xl border p-4 text-left transition-all shadow-sm hover:shadow-md ${
                  filterStatus === s
                    ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
                    : 'border-slate-100 bg-white'
                }`}
              >
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badgeClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                  {s}
                </span>
                <p className="mt-2 text-2xl font-extrabold text-slate-800">
                  {pagination ? (filterStatus === s || !filterStatus ? counts[s] : '...') : counts[s]}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">on this page</p>
              </button>
            )
          })}
        </div>

        {/* ── Filters ────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-5">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All statuses</option>
            {VALID_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
          </select>

          {(filterStatus || filterCategory) && (
            <button
              onClick={() => { setFilterStatus(''); setFilterCategory('') }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:border-red-200 shadow-sm transition-colors"
            >
              Clear filters
            </button>
          )}

          <button
            onClick={fetchReports}
            className="ml-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 hover:text-blue-700 hover:border-blue-300 shadow-sm transition-colors flex items-center gap-1.5"
            aria-label="Refresh reports"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {error && (
          <div role="alert" className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
            <button onClick={fetchReports} className="ml-2 underline font-semibold">Retry</button>
          </div>
        )}

        {/* ── Loading skeleton ───────────────────────────────────────────── */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Empty state ────────────────────────────────────────────────── */}
        {!loading && !error && reports.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <svg className="h-16 w-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-semibold text-slate-500">No reports found</p>
            <p className="text-sm mt-1">Try clearing filters or refreshing.</p>
          </div>
        )}

        {/* ── Report table ───────────────────────────────────────────────── */}
        {!loading && reports.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Desktop table header */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <span>Reference</span>
              <span>Category</span>
              <span>Location</span>
              <span>Submitted</span>
              <span>Status</span>
            </div>

            <ul className="divide-y divide-slate-50">
              {reports.map((report) => {
                const isExpanded = expanded === report.id
                return (
                  <li key={report.id}>
                    {/* Row */}
                    <div
                      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr_1fr_1fr] gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : report.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setExpanded(isExpanded ? null : report.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`detail-${report.id}`}
                    >
                      {/* Ref */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-blue-700">{report.ref_number}</span>
                        <svg className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Category */}
                      <span className="text-sm text-slate-700 capitalize">
                        {CATEGORIES.find((c) => c.value === report.category)?.emoji}{' '}
                        {categoryLabel(report.category)}
                      </span>

                      {/* Location */}
                      <span className="text-sm text-slate-600 truncate" title={report.location}>
                        {report.location}
                      </span>

                      {/* Date */}
                      <span className="text-sm text-slate-500">{formatDate(report.created_at)}</span>

                      {/* Status — stop propagation so click on select doesn't toggle row */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <StatusSelect
                          reportId={report.id}
                          current={report.status}
                          onUpdated={handleStatusUpdated}
                        />
                      </div>
                    </div>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <div
                        id={`detail-${report.id}`}
                        className="px-6 pb-5 pt-1 bg-blue-50/40 border-t border-blue-100"
                      >
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">Description</p>
                            <p className="text-slate-700 leading-relaxed">{report.description}</p>
                          </div>

                          {(report.users?.name || report.users?.email) && (
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">Submitted by</p>
                              <p className="text-slate-700">{report.users?.name}</p>
                              <p className="text-slate-500 text-xs">{report.users?.email}</p>
                            </div>
                          )}

                          {report.contact && (
                            <div>
                              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">Contact</p>
                              <p className="text-slate-700">{report.contact}</p>
                            </div>
                          )}

                          {report.image_url && (
                            <div className="sm:col-span-2">
                              <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">Photo</p>
                              <a href={report.image_url} target="_blank" rel="noreferrer" className="inline-block">
                                <img
                                  src={report.image_url}
                                  alt="Report evidence"
                                  className="h-36 w-auto rounded-xl border border-slate-200 object-cover hover:opacity-90 transition-opacity"
                                  loading="lazy"
                                />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6 text-sm">
            <p className="text-slate-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
