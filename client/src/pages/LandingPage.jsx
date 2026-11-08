/**
 * LandingPage — "/"
 * Hero, category quick-links, 3-step how-it-works.
 */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../constants'

// ── How it works steps ────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '1',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: 'Report the problem',
    desc:  'Describe the issue, add your location, attach a photo, and submit in under a minute.',
  },
  {
    num: '2',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Get a reference number',
    desc:  'You instantly receive a unique reference number like CF-2026-0001. Save it!',
  },
  {
    num: '3',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Track your progress',
    desc:  'Enter your reference number any time to see whether your report is Pending, In Progress, or Resolved.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  const handleCategoryClick = (category) => {
    navigate(`/report?category=${category}`)
  }

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 text-white"
      >
        {/* decorative blobs */}
        <div aria-hidden="true" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium mb-6">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" aria-hidden="true" />
            Campus Problem Reporting
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
          >
            See a problem on campus?
            <br />
            <span className="text-teal-300">Report it. Track it. Get it fixed.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Submit maintenance and facility issues directly to the right team. No phone calls, no chasing. Just a reference number and real-time updates.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-colors min-h-14"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Report a Problem
            </Link>
            <Link
              to="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-colors min-h-14"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Track a Report
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <section aria-label="Platform statistics" className="bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 divide-x divide-blue-700/50">
            {[
              { n: '500+', label: 'Reports submitted' },
              { n: '72h',  label: 'Average response time' },
              { n: '94%',  label: 'Issues resolved' },
            ].map(({ n, label }) => (
              <div key={label} className="py-5 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-300">{n}</p>
                <p className="text-xs sm:text-sm text-blue-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category quick-links ──────────────────────────────────────────── */}
      <section aria-labelledby="categories-heading" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 id="categories-heading" className="text-2xl sm:text-3xl font-bold text-slate-800">
            What would you like to report?
          </h2>
          <p className="mt-2 text-slate-500">Select a category to open the report form</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-center focus-visible:outline-2 focus-visible:outline-blue-600"
              aria-label={`Report a ${cat.label} issue`}
            >
              <span className="text-3xl" aria-hidden="true">{cat.emoji}</span>
              <span className="text-xs font-semibold text-slate-700 leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section
        aria-labelledby="how-heading"
        className="bg-gradient-to-b from-blue-50 to-white py-16"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold text-slate-800">
              How it works
            </h2>
            <p className="mt-2 text-slate-500">Three simple steps to get your issue resolved</p>
          </div>

          <ol className="grid sm:grid-cols-3 gap-6 sm:gap-8" aria-label="How CampusFix works">
            {STEPS.map((step, idx) => (
              <li
                key={idx}
                className="relative flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
              >
                {/* connector line on desktop */}
                {idx < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden sm:block absolute top-10 left-[calc(100%+1px)] w-full h-0.5 bg-blue-100 -z-10"
                    style={{ width: 'calc(100% - 2rem)' }}
                  />
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 mb-4">
                  {step.icon}
                </div>
                <span className="absolute top-4 right-4 text-xs font-bold text-blue-300">0{step.num}</span>
                <h3 className="text-base font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-2xl shadow-md transition-colors text-lg"
            >
              Get Started. It's Free
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
