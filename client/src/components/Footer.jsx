/**
 * Footer — simple site footer.
 */
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-slate-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white text-sm font-extrabold">
              CF
            </span>
            <span className="font-bold text-blue-800">CampusFix</span>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
            <Link to="/"       className="hover:text-blue-700 transition-colors">Home</Link>
            <Link to="/report" className="hover:text-blue-700 transition-colors">Report</Link>
            <Link to="/track"  className="hover:text-blue-700 transition-colors">Track</Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-slate-400 text-center">
            © {year} CampusFix. Making campus life better.
          </p>
        </div>
      </div>
    </footer>
  )
}
