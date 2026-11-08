/**
 * Navbar — responsive top navigation.
 * Collapses to hamburger menu on mobile.
 */
import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/',       label: 'Home',             exact: true },
  { to: '/report', label: 'Report a Problem'              },
  { to: '/track',  label: 'Track a Report'                },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (open && !menuRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on route change
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-blue-800 hover:text-blue-700 transition-colors"
            aria-label="CampusFix – home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white text-lg font-extrabold shadow-sm">
              CF
            </span>
            <span className="hidden sm:inline">CampusFix</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA button (desktop) */}
          <Link
            to="/report"
            className="hidden md:inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Report
          </Link>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1"
        >
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={close}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/report"
            onClick={close}
            className="mt-1 flex items-center justify-center gap-1.5 bg-teal-600 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
          >
            + New Report
          </Link>
        </div>
      )}
    </header>
  )
}
