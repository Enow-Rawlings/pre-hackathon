/**
 * App.jsx — root component with routing.
 *
 * Route structure (public-facing):
 *   /                            → LandingPage
 *   /report                      → ReportPage
 *   /report/success/:reference   → ConfirmationPage
 *   /track                       → TrackPage
 *   /track/:reference            → TrackPage (auto-loads result)
 *   *                            → NotFoundPage
 *
 * Admin routes will be nested under /admin in a future module.
 * Example:
 *   import AdminRoutes from './admin/AdminRoutes'
 *   <Route path="/admin/*" element={<AdminRoutes />} />
 */
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'

import LandingPage      from './pages/LandingPage'
import ReportPage       from './pages/ReportPage'
import ConfirmationPage from './pages/ConfirmationPage'
import TrackPage        from './pages/TrackPage'
import NotFoundPage     from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />

          {/* Page content */}
          <div className="flex-1">
            <Routes>
              <Route path="/"                           element={<LandingPage />} />
              <Route path="/report"                     element={<ReportPage />} />
              <Route path="/report/success/:reference"  element={<ConfirmationPage />} />
              <Route path="/track"                      element={<TrackPage />} />
              <Route path="/track/:reference"           element={<TrackPage />} />

              {/* ── Future admin module ──────────────────────────────────
               *  Uncomment and implement when building the admin area:
               *  <Route path="/admin/*" element={<AdminRoutes />} />
               * ──────────────────────────────────────────────────────── */}

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}
