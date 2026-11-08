/**
 * reportService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * ALL data-access for reports lives here.  The rest of the app never touches
 * localStorage directly, so swapping in a real REST/GraphQL API later only
 * requires changing this file.
 *
 * Public API (used by the public-facing UI):
 *   createReport(data)              → saved report object
 *   getReportByReference(reference) → report | null
 *
 * Stub API (reserved for the future admin module — DO NOT build UI yet):
 *   listReports(filters)            → [report]
 *   updateReportStatus(id, status)  → updated report
 */

import { LS_KEY, STATUSES } from '../constants'
import { generateReference } from '../utils/referenceNumber'

// ─── Simulated network delay ──────────────────────────────────────────────────
const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms))

// ─── Storage helpers ──────────────────────────────────────────────────────────
function readAll() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(reports) {
  localStorage.setItem(LS_KEY, JSON.stringify(reports))
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_REPORTS = [
  {
    id: 'seed-1',
    reference: 'CF-2026-0001',
    category: 'electrical',
    location: 'Science Block, Room 204',
    description: 'Three power sockets near the lab benches have stopped working. Students cannot charge equipment or run experiments.',
    contact: 'kwame.asante@university.edu',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', publicId: 'seed_img_1' },
    ],
    status: STATUSES.RESOLVED,
    createdAt:  '2026-10-01T09:15:00.000Z',
    updatedAt:  '2026-10-05T14:30:00.000Z',
  },
  {
    id: 'seed-2',
    reference: 'CF-2026-0002',
    category: 'plumbing',
    location: 'Main Library, Ground Floor Toilets',
    description: 'The second sink in the male restroom is leaking badly. Water has pooled on the floor creating a slip hazard for everyone using the facility.',
    contact: '',
    images: [],
    status: STATUSES.IN_PROGRESS,
    createdAt:  '2026-10-10T11:00:00.000Z',
    updatedAt:  '2026-10-12T08:45:00.000Z',
  },
  {
    id: 'seed-3',
    reference: 'CF-2026-0003',
    category: 'internet',
    location: 'Engineering Block, Floor 3',
    description: 'Wi-Fi signal is extremely weak on the entire third floor of the Engineering building. Cannot connect to university network for online assignments.',
    contact: '+233 24 555 7890',
    images: [
      { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800', publicId: 'seed_img_3' },
    ],
    status: STATUSES.PENDING,
    createdAt:  '2026-10-18T15:30:00.000Z',
    updatedAt:  '2026-10-18T15:30:00.000Z',
  },
  {
    id: 'seed-4',
    reference: 'CF-2026-0004',
    category: 'security',
    location: 'Female Hostel Block B, Gate',
    description: 'The electronic lock on the main gate of Female Hostel Block B is broken and stays open all night. This is a serious security concern for residents.',
    contact: 'security.concern@university.edu',
    images: [],
    status: STATUSES.IN_PROGRESS,
    createdAt:  '2026-10-20T22:10:00.000Z',
    updatedAt:  '2026-10-21T09:00:00.000Z',
  },
  {
    id: 'seed-5',
    reference: 'CF-2026-0005',
    category: 'cleanliness',
    location: 'Student Union Building, Cafeteria',
    description: 'The bins in the cafeteria have been overflowing since Monday. Food waste is attracting flies and creating an unhygienic environment.',
    contact: '',
    images: [
      { url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800', publicId: 'seed_img_5' },
    ],
    status: STATUSES.PENDING,
    createdAt:  '2026-11-01T07:45:00.000Z',
    updatedAt:  '2026-11-01T07:45:00.000Z',
  },
  {
    id: 'seed-6',
    reference: 'CF-2026-0006',
    category: 'furniture',
    location: 'Lecture Hall LH-07',
    description: 'Approximately 12 chairs in Lecture Hall LH-07 have broken armrests or unstable legs. Students have to stand or share seats during lectures.',
    contact: '',
    images: [],
    status: STATUSES.RESOLVED,
    createdAt:  '2026-09-15T10:00:00.000Z',
    updatedAt:  '2026-09-22T11:20:00.000Z',
  },
]

/**
 * Seed the store once on first load (only if empty).
 */
function seedIfEmpty() {
  const existing = readAll()
  if (existing.length === 0) {
    writeAll(SEED_REPORTS)
  }
}

// Run seed immediately when the module is first imported
seedIfEmpty()

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * createReport(data)
 * Validates, persists, and returns the new report with an auto-generated
 * reference number and timestamps.
 *
 * @param {{ category, location, description, contact, images }} data
 * @returns {Promise<Object>} the saved report
 */
export async function createReport(data) {
  await delay()

  const now = new Date().toISOString()
  const report = {
    id:          crypto.randomUUID(),
    reference:   generateReference(),
    category:    data.category,
    location:    data.location,
    description: data.description,
    contact:     data.contact || '',
    images:      data.images  || [],
    status:      STATUSES.PENDING,
    createdAt:   now,
    updatedAt:   now,
  }

  const reports = readAll()
  reports.unshift(report) // newest first
  writeAll(reports)
  return report
}

/**
 * getReportByReference(reference)
 * Case-insensitive lookup.
 *
 * @param {string} reference  e.g. "CF-2026-0001"
 * @returns {Promise<Object|null>}
 */
export async function getReportByReference(reference) {
  await delay()
  const normalised = reference.trim().toUpperCase()
  const reports = readAll()
  return reports.find((r) => r.reference === normalised) ?? null
}

// ─── Stubs for the future admin module ───────────────────────────────────────
// TODO (admin module): implement real filtering, sorting, and pagination.

/**
 * listReports(filters?)
 * Returns all reports, optionally filtered by status or category.
 * Reserved for the admin module — no public UI should call this.
 *
 * @param {{ status?: string, category?: string }} [filters]
 * @returns {Promise<Object[]>}
 */
export async function listReports(filters = {}) {
  await delay()
  let reports = readAll()
  if (filters.status)   reports = reports.filter((r) => r.status   === filters.status)
  if (filters.category) reports = reports.filter((r) => r.category === filters.category)
  return reports
}

/**
 * updateReportStatus(id, status)
 * Updates the status of a report by its UUID.
 * Reserved for the admin module — no public UI should call this.
 *
 * @param {string} id
 * @param {string} status  one of STATUSES.*
 * @returns {Promise<Object|null>}
 */
export async function updateReportStatus(id, status) {
  await delay()
  const reports = readAll()
  const idx = reports.findIndex((r) => r.id === id)
  if (idx === -1) return null
  reports[idx] = { ...reports[idx], status, updatedAt: new Date().toISOString() }
  writeAll(reports)
  return reports[idx]
}
