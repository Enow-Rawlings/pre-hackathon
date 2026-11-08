/**
 * AdminLogin — /admin/login
 * Simple email + password form. Rejects non-admin accounts.
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from './useAdminAuth'
import Button from '../components/Button'

export default function AdminLogin() {
  const navigate        = useNavigate()
  const { login, loading, error } = useAdminAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email.trim(), password)
    if (ok) navigate('/admin', { replace: true })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white font-extrabold text-lg shadow">
            CF
          </span>
          <span className="text-2xl font-extrabold text-blue-800">CampusFix</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="text-xl font-bold text-slate-800 mb-1">Admin sign in</h1>
          <p className="text-sm text-slate-500 mb-6">Manage and update campus reports.</p>

          {error && (
            <div role="alert" className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="admin@campusfix.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!email || !password}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          CampusFix Admin Portal. Authorised users only.
        </p>
      </div>
    </main>
  )
}
