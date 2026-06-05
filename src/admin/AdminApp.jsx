import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useContent } from '../content/ContentContext'
import AdminLogin from './AdminLogin'
import HeroEditor from './editors/HeroEditor'
import AboutEditor from './editors/AboutEditor'
import ServicesEditor from './editors/ServicesEditor'
import ExperiencesEditor from './editors/ExperiencesEditor'
import FinalCtaEditor from './editors/FinalCtaEditor'
import ContactEditor from './editors/ContactEditor'
import GalleryEditor from './editors/GalleryEditor'

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'finalCta', label: 'Final CTA' },
  { id: 'contact', label: 'Contact' },
]

export default function AdminApp() {
  const { user, logout, authFetch } = useAuth()
  const { content: liveContent, refresh } = useContent()

  const [draft, setDraft] = useState(null)
  const [section, setSection] = useState('hero')
  const [status, setStatus] = useState({ kind: 'idle', message: '' })
  const [authError, setAuthError] = useState('')

  // Pull the freshest admin copy when entering the panel — public /api/content
  // is cached, /api/admin/content is not.
  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await authFetch('/api/admin/content')
        if (res.status === 401 || res.status === 403) {
          setAuthError(res.status === 403 ? 'This account is not authorized.' : 'Session expired.')
          return
        }
        const data = await res.json()
        if (!cancelled) setDraft(data)
      } catch {
        if (!cancelled) setDraft(liveContent)
      }
    })()
    return () => { cancelled = true }
  }, [user, authFetch, liveContent])

  const dirty = useMemo(
    () => draft && JSON.stringify(draft) !== JSON.stringify(liveContent),
    [draft, liveContent],
  )

  async function save() {
    if (!draft) return
    setStatus({ kind: 'saving', message: 'Saving…' })
    try {
      const res = await authFetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error((await res.json())?.error || 'Save failed')
      await refresh()
      setStatus({ kind: 'success', message: 'Saved' })
      setTimeout(() => setStatus({ kind: 'idle', message: '' }), 2500)
    } catch (err) {
      setStatus({ kind: 'error', message: err.message })
    }
  }

  if (!user) return <AdminLogin />
  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink p-8 text-center">
        <div>
          <p className="text-sm text-red-400">{authError}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-4 rounded-full border border-gold px-5 py-2 text-xs tracking-wide text-gold hover:bg-gold hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-sm text-muted">
        Loading editor…
      </div>
    )
  }

  const update = (key, value) => setDraft({ ...draft, [key]: value })

  let editor = null
  if (section === 'hero') editor = <HeroEditor value={draft.hero} onChange={(v) => update('hero', v)} />
  else if (section === 'about') editor = <AboutEditor value={draft.about} onChange={(v) => update('about', v)} />
  else if (section === 'services') editor = <ServicesEditor value={draft.services} onChange={(v) => update('services', v)} />
  else if (section === 'experiences') editor = <ExperiencesEditor value={draft.experiences} onChange={(v) => update('experiences', v)} />
  else if (section === 'gallery') editor = <GalleryEditor value={draft.gallery} onChange={(v) => update('gallery', v)} />
  else if (section === 'finalCta') editor = <FinalCtaEditor value={draft.finalCta} onChange={(v) => update('finalCta', v)} />
  else if (section === 'contact') editor = (
    <ContactEditor
      contact={draft.contact}
      contactForm={draft.contactForm}
      onChange={({ contact, contactForm }) => setDraft({ ...draft, contact, contactForm })}
    />
  )

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs uppercase tracking-[0.3em] text-gold hover:text-cream">
              ← View site
            </Link>
            <span className="text-xs uppercase tracking-[0.3em] text-muted">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            {status.message && (
              <span
                className={
                  status.kind === 'error'
                    ? 'text-xs text-red-400'
                    : status.kind === 'success'
                      ? 'text-xs text-green-400'
                      : 'text-xs text-muted'
                }
              >
                {status.message}
              </span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!dirty || status.kind === 'saving'}
              className="rounded-full bg-gold px-5 py-2 text-xs font-medium tracking-wide text-ink transition-all hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
            >
              {dirty ? 'Save changes' : 'Saved'}
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              {user.picture && (
                <img src={user.picture} alt="" className="h-7 w-7 rounded-full" />
              )}
              <span className="text-xs text-muted">{user.email}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-muted hover:text-gold"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[200px_1fr] lg:px-8">
        {/* Sidebar */}
        <nav className="space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm tracking-wide transition-colors ${
                section === s.id
                  ? 'bg-gold/10 text-gold'
                  : 'text-muted hover:bg-cream/5 hover:text-cream'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Editor */}
        <div className="rounded-lg border border-line bg-ink-2 p-6 lg:p-8">
          {editor}
        </div>
      </div>
    </div>
  )
}
