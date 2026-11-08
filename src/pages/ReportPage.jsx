/**
 * ReportPage — "/report"
 * Multi-field form with validation, photo upload, and loading state.
 */
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '../constants'
import { createReport } from '../services/reportService'
import Button    from '../components/Button'
import Input     from '../components/Input'
import Select    from '../components/Select'
import Textarea  from '../components/Textarea'
import PhotoUpload from '../components/PhotoUpload'
import { useToast } from '../components/Toast'

const MIN_DESC = 20
const MAX_DESC = 1000

function validate(fields) {
  const errors = {}
  if (!fields.category)                   errors.category    = 'Please choose a category.'
  if (!fields.location.trim())            errors.location    = 'Location is required.'
  if (fields.description.trim().length < MIN_DESC)
    errors.description = `Description must be at least ${MIN_DESC} characters.`
  return errors
}

export default function ReportPage() {
  const navigate       = useNavigate()
  const [params]       = useSearchParams()
  const { showToast }  = useToast()
  const firstErrorRef  = useRef(null)

  const [fields, setFields] = useState({
    category:    params.get('category') || '',
    location:    '',
    description: '',
    contact:     '',
  })
  const [images,    setImages]    = useState([])   // [{url, publicId}]
  const [errors,    setErrors]    = useState({})
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Pre-select category from URL query param
  useEffect(() => {
    const cat = params.get('category')
    if (cat) setFields((f) => ({ ...f, category: cat }))
  }, [params])

  const set = (name) => (e) => {
    const val = e?.target?.value ?? e
    setFields((f) => ({ ...f, [name]: val }))
    if (errors[name]) setErrors((e) => { const n = { ...e }; delete n[name]; return n })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate(fields)
    if (Object.keys(errs).length) {
      setErrors(errs)
      // Scroll to first error field
      requestAnimationFrame(() => {
        const el = document.querySelector('[aria-invalid="true"]')
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el?.focus()
      })
      return
    }

    setSubmitting(true)
    try {
      const report = await createReport({ ...fields, images })
      navigate(`/report/success/${report.reference}`)
    } catch (err) {
      console.error(err)
      showToast('Something went wrong. Please try again.', 'error')
      setSubmitting(false)
    }
  }

  const busy = uploading || submitting

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Report a Problem</h1>
        <p className="mt-1 text-slate-500">
          Fill in the details below and we'll make sure the right team gets your report.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* ── Category ────────────────────────────────────────────────────── */}
        <Select
          id="category"
          label="Category"
          required
          options={CATEGORIES}
          placeholder="Choose a category…"
          value={fields.category}
          error={errors.category}
          onChange={(e) => {
            setFields((f) => ({ ...f, category: e.target.value }))
            if (errors.category) setErrors((er) => { const n = { ...er }; delete n.category; return n })
          }}
        />

        {/* ── Location ────────────────────────────────────────────────────── */}
        <Input
          id="location"
          label="Campus Location"
          required
          placeholder="e.g. Science Block, Room 204"
          value={fields.location}
          error={errors.location}
          onChange={set('location')}
        />

        {/* ── Description ─────────────────────────────────────────────────── */}
        <Textarea
          id="description"
          label="Description"
          required
          placeholder="Describe the problem in detail — what it is, how long it's been there, and any safety concerns…"
          value={fields.description}
          minLength={MIN_DESC}
          maxLength={MAX_DESC}
          error={errors.description}
          onChange={set('description')}
        />

        {/* ── Photo evidence ──────────────────────────────────────────────── */}
        <fieldset>
          <legend className="text-sm font-semibold text-slate-700 mb-2">
            Photo Evidence <span className="font-normal text-slate-400">(optional)</span>
          </legend>
          <PhotoUpload
            value={images}
            onChange={(imgs) => {
              setImages(imgs)
              // Track if any image is mid-upload
              setUploading(false)
            }}
            onUploadStart={() => setUploading(true)}
            onUploadEnd={()   => setUploading(false)}
          />
        </fieldset>

        {/* ── Contact ─────────────────────────────────────────────────────── */}
        <Input
          id="contact"
          label="Contact (email or phone)"
          placeholder="e.g. student@university.edu or +233 24 555 0000"
          value={fields.contact}
          hint="Optional. Only used to follow up on your report — never shared publicly."
          onChange={set('contact')}
        />

        {/* ── Submit ──────────────────────────────────────────────────────── */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            disabled={busy}
            className="w-full"
            aria-describedby={uploading ? 'upload-notice' : undefined}
          >
            {submitting ? 'Submitting…' : uploading ? 'Waiting for uploads…' : 'Submit Report'}
          </Button>
          {uploading && (
            <p id="upload-notice" className="mt-2 text-xs text-amber-600 text-center">
              Please wait for all images to finish uploading.
            </p>
          )}
        </div>
      </form>
    </main>
  )
}
