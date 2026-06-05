import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { googleLogout } from '@react-oauth/google'

// Persisted in localStorage so the admin stays logged in across reloads.
// The ID token is verified server-side on every protected request; if it's
// expired or invalid, those requests return 401 and we drop the session.
const STORAGE_KEY = 'admin-session'

const AuthContext = createContext({
  user: null,
  token: null,
  loginWithCredential: () => {},
  logout: () => {},
  authFetch: () => Promise.reject(new Error('AuthProvider missing')),
})

function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      // Drop expired tokens on startup (exp is in seconds).
      if (parsed?.exp && parsed.exp * 1000 < Date.now()) return null
      return parsed
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else window.localStorage.removeItem(STORAGE_KEY)
  }, [session])

  const loginWithCredential = useCallback((credential) => {
    const payload = decodeJwtPayload(credential)
    if (!payload) return
    setSession({
      token: credential,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      exp: payload.exp,
    })
  }, [])

  const logout = useCallback(() => {
    googleLogout()
    setSession(null)
  }, [])

  const authFetch = useCallback(
    async (input, init = {}) => {
      const headers = new Headers(init.headers || {})
      if (session?.token) headers.set('Authorization', `Bearer ${session.token}`)
      const res = await fetch(input, { ...init, headers })
      // If the token is rejected, force a re-login.
      if (res.status === 401) setSession(null)
      return res
    },
    [session],
  )

  const value = useMemo(
    () => ({
      user: session
        ? { email: session.email, name: session.name, picture: session.picture }
        : null,
      token: session?.token || null,
      loginWithCredential,
      logout,
      authFetch,
    }),
    [session, loginWithCredential, logout, authFetch],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
