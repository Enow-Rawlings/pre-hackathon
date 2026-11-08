/**
 * reportService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All report data-access — now wired to the CampusFix REST API.
 *
 * Public API (used by the public-facing UI):
 *   createReport(data)              → saved report object
 *   getReportByReference(reference) → report | null
 *
 * Admin API:
 *   listReports(filters)            → { reports, pagination }
 *   updateReportStatus(id, status)  → updated report
 */

const API_BASE = import.meta.env.VITE_API_URL

if (!API_BASE) {
  console.warn('[CampusFix] VITE_API_URL is not set — API calls will fail.')
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('campusfix_token')
}

async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // Don't set Content-Type when sending FormData — browser sets it with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `Request failed: ${res.status}`)
  }

  return res.json()
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * createReport(data)
 * Submits a new report. Images must already be uploaded to Cloudinary and
 * passed as [{ url, publicId }].
 *
 * NOTE: the backend accepts the report as JSON (no file upload at this step —
 * cloudinaryService.js handles the direct Cloudinary upload separately, then
 * we pass the resulting URL here).
 *
 * @param {{ category, location, description, contact, images }} data
 * @returns {Promise<Object>} the saved report  { ref_number, status, ... }
 */
export async function createReport(data) {
  // Pick the first image URL if any were uploaded via cloudinaryService
  const image_url = data.images?.[0]?.url ?? null

  const body = {
    category:    data.category,
    location:    data.location,
    description: data.description,
    contact:     data.contact || '',
    image_url,
  }

  const json = await apiFetch('/api/reports/guest', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  // Normalise the response shape so the rest of the UI keeps working
  const r = json.report
  return {
    id:          r.id,
    reference:   r.ref_number,   // frontend expects "reference"
    category:    r.category,
    location:    r.location,
    description: r.description,
    images:      r.image_url ? [{ url: r.image_url, publicId: '' }] : [],
    status:      r.status,
    createdAt:   r.created_at,
    updatedAt:   r.updated_at,
  }
}

/**
 * getReportByReference(reference)
 * Case-insensitive public lookup — no auth required.
 *
 * @param {string} reference  e.g. "CFX-20261108-A3F9"
 * @returns {Promise<Object|null>}
 */
export async function getReportByReference(reference) {
  try {
    const json = await apiFetch(`/api/reports/status/${encodeURIComponent(reference.trim().toUpperCase())}`)
    const r = json.report
    return {
      id:          r.id,
      reference:   r.ref_number,
      category:    r.category,
      location:    r.location,
      description: r.description,
      images:      r.image_url ? [{ url: r.image_url, publicId: '' }] : [],
      status:      r.status,
      createdAt:   r.created_at,
      updatedAt:   r.updated_at,
    }
  } catch (err) {
    if (err.message?.includes('404') || err.message?.toLowerCase().includes('not found')) {
      return null
    }
    throw err
  }
}

// ─── Admin API ────────────────────────────────────────────────────────────────

/**
 * listReports(filters?)
 * Requires admin JWT in localStorage.
 *
 * @param {{ status?: string, category?: string, page?: number, limit?: number }} [filters]
 * @returns {Promise<{ reports: Object[], pagination: Object }>}
 */
export async function listReports(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status)   params.set('status',   filters.status)
  if (filters.category) params.set('category', filters.category)
  if (filters.page)     params.set('page',     filters.page)
  if (filters.limit)    params.set('limit',    filters.limit)

  const qs = params.toString()
  return apiFetch(`/api/reports${qs ? `?${qs}` : ''}`)
}

/**
 * updateReportStatus(id, status)
 * Requires admin JWT in localStorage.
 *
 * @param {string} id
 * @param {string} status  'Pending' | 'In Progress' | 'Resolved'
 * @returns {Promise<Object>}
 */
export async function updateReportStatus(id, status) {
  const json = await apiFetch(`/api/reports/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return json.report
}
