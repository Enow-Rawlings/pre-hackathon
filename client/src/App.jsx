/**
 * App.jsx — root component with routing.
 *
 * Route structure:
 *   /                            → LandingPage
 *   /report                      → ReportPage
 *   /report/success/:reference   → ConfirmationPage
 *   /track                       → TrackPage
 *   /track/:reference            → TrackPage (auto-loads result)
 *   /admin/login                 → AdminLogin
 *   /admin                       → AdminDashboard (protected)
 *   *                            → NotFoundPage
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

import AdminLogin       from './admin/AdminLogin'
import AdminDashboard   from './admin/AdminDashboard'
import RequireAdmin     from './admin/RequireAdmin'

// Admin routes use their own full-page layout (no shared Navbar/Footer)
function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        index
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Admin area — own layout, no public Navbar/Footer */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Public area — shared layout */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/"                           element={<LandingPage />} />
                    <Route path="/report"                     element={<ReportPage />} />
                    <Route path="/report/success/:reference"  element={<ConfirmationPage />} />
                    <Route path="/track"                      element={<TrackPage />} />
                    <Route path="/track/:reference"           element={<TrackPage />} />
                    <Route path="*"                           element={<NotFoundPage />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            }
          />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
