/**
 * useAdminAuth — lightweight admin auth hook.
 * Stores the JWT + user object in localStorage under campusfix_token / campusfix_user.
 */
import { useState, useCallback } from 'react'

const TOKEN_KEY = 'campusfix_token'
const USER_KEY  = 'campusfix_user'

const API_BASE = import.meta.env.VITE_API_URL

export function useAdminAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      if (!data.user?.is_admin) throw new Error('Access denied. Admin accounts only.')

      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY,  JSON.stringify(data.user))
      setUser(data.user)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  return { user, error, loading, login, logout }
}
