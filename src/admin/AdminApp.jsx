import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useContent } from '../content/ContentContext'
import AdminLogin from './AdminLogin'
import HeroEditor from './editors/HeroEditor'
import ServicesEditor from './editors/ServicesEditor'
import ExperiencesEditor from './editors/ExperiencesEditor'
import FinalCtaEditor from './editors/FinalCtaEditor'
import ContactEditor from './editors/ContactEditor'
import GalleryEditor from './editors/GalleryEditor'
import AnalyticsView from './editors/AnalyticsView'
import LeadsView from './editors/LeadsView'

// Grouped, Spanish navigation: Contenido (editable site content) + Analíticas.
const NAV = [
  {
    group: 'Contenido',
    items: [
      { id: 'hero', label: 'Hero' },
      { id: 'services', label: 'Servicios' },
      { id: 'experiences', label: 'Experiencias' },
      { id: 'gallery', label: 'Galería' },
      { id: 'finalCta', label: 'CTA Final' },
      { id: 'contact', label: 'Contacto' },
    ],
  },
  {
    group: 'Analíticas',
    items: [
      { id: 'analytics', label: 'Visitas desde el QR' },
      { id: 'leads', label: 'Clientes potenciales' },
    ],
  },
]

const CONTENT_IDS = NAV[0].items.map((i) => i.id)
const ALL_ITEMS = NAV.flatMap((g) => g.items)

// Module-scope so it isn't recreated each render. Desktop sidebar only — the
// mobile dropdown uses the accordion MobileNav defined below.
function AdminNav({ section, onSelect }) {
  return (
    <nav className="space-y-5">
      {NAV.map((g) => (
        <div key={g.group}>
          <p className="px-3 pb-1 text-[0.65rem] uppercase tracking-[0.25em] text-muted/70">
            {g.group}
          </p>
          <div className="space-y-1">
            {g.items.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelect(s.id)}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm tracking-wide transition-colors ${
                  section === s.id
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted hover:bg-cream/5 hover:text-cream'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

// Mobile-only accordion nav: each group (Contenido / Analíticas) is a tappable
// header that expands/collapses its pages. The group containing the active
// section starts open. Desktop keeps the always-expanded AdminNav above.
function MobileNav({ section, onSelect }) {
  const activeGroup = NAV.find((g) => g.items.some((i) => i.id === section))?.group
  const [open, setOpen] = useState(() => (activeGroup ? { [activeGroup]: true } : {}))
  const toggle = (group) => setOpen((o) => ({ ...o, [group]: !o[group] }))

  return (
    <nav className="space-y-1">
      {NAV.map((g) => {
        const isOpen = !!open[g.group]
        const hasActive = g.items.some((i) => i.id === section)
        return (
          <div key={g.group} className="border-b border-line/60 last:border-b-0">
            <button
              type="button"
              onClick={() => toggle(g.group)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between px-3 py-3 text-left text-xs uppercase tracking-[0.25em] transition-colors ${
                hasActive ? 'text-gold' : 'text-muted/80 hover:text-cream'
              }`}
            >
              <span>{g.group}</span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={`h-4 w-4 fill-current transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                <path d="M12 15.5a1 1 0 0 1-.71-.29l-5-5a1 1 0 1 1 1.42-1.42L12 13.09l4.29-4.3a1 1 0 0 1 1.42 1.42l-5 5a1 1 0 0 1-.71.29Z" />
              </svg>
            </button>
            {isOpen && (
              <div className="space-y-1 pb-3 pl-2">
                {g.items.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelect(s.id)}
                    className={`block w-full rounded-md px-3 py-2.5 text-left text-sm tracking-wide transition-colors ${
                      section === s.id
                        ? 'bg-gold/10 text-gold'
                        : 'text-muted hover:bg-cream/5 hover:text-cream'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default function AdminApp() {
  const { user, logout, authFetch } = useAuth()
  const { content: liveContent, refresh } = useContent()

  const [draft, setDraft] = useState(null)
  const [section, setSection] = useState('hero')
  const [navOpen, setNavOpen] = useState(false)
  const [status, setStatus] = useState({ kind: 'idle', message: '' })
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await authFetch('/api/admin/content')
        if (res.status === 401 || res.status === 403) {
          setAuthError(
            res.status === 403 ? 'Esta cuenta no está autorizada.' : 'La sesión expiró.',
          )
          return
        }
        const data = await res.json()
        if (!cancelled) setDraft(data)
      } catch {
        if (!cancelled) setDraft(liveContent)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user, authFetch, liveContent])

  const dirty = useMemo(
    () => draft && JSON.stringify(draft) !== JSON.stringify(liveContent),
    [draft, liveContent],
  )

  async function save() {
    if (!draft) return
    setStatus({ kind: 'saving', message: 'Guardando…' })
    try {
      const res = await authFetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error((await res.json())?.error || 'No se pudo guardar')
      await refresh()
      setStatus({ kind: 'success', message: 'Guardado' })
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
            Cerrar sesión
          </button>
        </div>
      </div>
    )
  }
  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-sm text-muted">
        Cargando…
      </div>
    )
  }

  const update = (key, value) => setDraft({ ...draft, [key]: value })
  const selectSection = (id) => {
    setSection(id)
    setNavOpen(false)
  }

  let editor = null
  if (section === 'hero')
    editor = <HeroEditor value={draft.hero} onChange={(v) => update('hero', v)} />
  else if (section === 'services')
    editor = <ServicesEditor value={draft.services} onChange={(v) => update('services', v)} />
  else if (section === 'experiences')
    editor = <ExperiencesEditor value={draft.experiences} onChange={(v) => update('experiences', v)} />
  else if (section === 'gallery')
    editor = <GalleryEditor value={draft.gallery} onChange={(v) => update('gallery', v)} />
  else if (section === 'finalCta')
    editor = <FinalCtaEditor value={draft.finalCta} onChange={(v) => update('finalCta', v)} />
  else if (section === 'contact')
    editor = (
      <ContactEditor
        contact={draft.contact}
        contactForm={draft.contactForm}
        onChange={({ contact, contactForm }) => setDraft({ ...draft, contact, contactForm })}
      />
    )
  else if (section === 'analytics') editor = <AnalyticsView />
  else if (section === 'leads') editor = <LeadsView />

  const isContent = CONTENT_IDS.includes(section)
  const currentLabel = ALL_ITEMS.find((i) => i.id === section)?.label || ''

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Menú"
              aria-expanded={navOpen}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-cream hover:text-gold lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                {navOpen ? (
                  <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z" />
                ) : (
                  <path d="M21 6a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h16a1 1 0 0 1 1 1m0 6a1 1 0 0 1-1 1H4a1 1 0 0 1 0-2h16a1 1 0 0 1 1 1m0 6a1 1 0 0 1-1 1H4a1 1 0 0 1 0-2h16a1 1 0 0 1 1 1" />
                )}
              </svg>
            </button>
            <Link
              to="/"
              className="hidden shrink-0 text-xs uppercase tracking-[0.3em] text-gold hover:text-cream sm:inline"
            >
              ← Ver sitio
            </Link>
            <span className="truncate text-xs uppercase tracking-[0.3em] text-muted lg:hidden">
              {currentLabel}
            </span>
            <span className="hidden text-xs uppercase tracking-[0.3em] text-muted lg:inline">
              Panel
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
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
            {isContent && (
              <button
                type="button"
                onClick={save}
                disabled={!dirty || status.kind === 'saving'}
                className="rounded-full bg-gold px-4 py-2 text-xs font-medium tracking-wide text-ink transition-all hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                {dirty ? 'Guardar' : 'Guardado'}
              </button>
            )}
            <button
              type="button"
              onClick={logout}
              className="text-xs text-muted hover:text-gold"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {navOpen && (
          <div className="border-t border-line bg-ink/95 px-4 py-3 lg:hidden">
            <MobileNav section={section} onSelect={selectSection} />
            <Link
              to="/"
              className="mt-4 block border-t border-line px-3 pt-4 text-xs uppercase tracking-[0.3em] text-gold hover:text-cream"
            >
              ← Ver sitio
            </Link>
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[210px_1fr] lg:px-8">
        {/* Sidebar — desktop only */}
        <div className="hidden lg:block">
          <AdminNav section={section} onSelect={selectSection} />
        </div>
        {/* Editor / view */}
        <div className="rounded-lg border border-line bg-ink-2 p-6 lg:p-8">{editor}</div>
      </div>
    </div>
  )
}
