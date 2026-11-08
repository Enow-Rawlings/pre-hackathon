/**
 * RequireAdmin — route guard.
 * Redirects to /admin/login if no valid admin token is in localStorage.
 */
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function RequireAdmin({ children }) {
  const token = localStorage.getItem('campusfix_token')
  const user  = (() => {
    try { return JSON.parse(localStorage.getItem('campusfix_user')) } catch { return null }
  })()

  const location = useLocation()

  if (!token || !user?.is_admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
