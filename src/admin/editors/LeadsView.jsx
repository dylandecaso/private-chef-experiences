import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'

const SERVICE_LABELS = {
  privateDinner: 'Cena Privada',
  weeklyMealPrep: 'Viandas Semanales',
  eventsCelebrations: 'Eventos y Celebraciones',
  healthyCustomized: 'Saludable y Personalizado',
  inHomeChef: 'Chef a Domicilio',
  other: 'Otro',
}
const SERVICE_KEYS = Object.keys(SERVICE_LABELS)

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', service: '' }

const inputClass =
  'w-full rounded-md border border-line bg-ink-3 px-3 py-2 text-sm text-cream placeholder-muted/50 outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/40'

export default function LeadsView() {
  const { authFetch } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/leads')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setLeads(Array.isArray(data.leads) ? data.leads : [])
      setError('')
    } catch {
      setError('No se pudieron cargar los clientes potenciales.')
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch that setStates only after await; benign data-load pattern.
    load()
  }, [load])

  const refresh = () => {
    setLoading(true)
    setError('')
    load()
  }

  const onField = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const add = async (e) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.email.trim()) {
      setError('Nombre y email son obligatorios.')
      return
    }
    setAdding(true)
    setError('')
    try {
      const res = await authFetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', lead: form }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.lead) setLeads((ls) => [data.lead, ...ls])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError('No se pudo agregar el cliente.')
    } finally {
      setAdding(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este cliente potencial?')) return
    const prev = leads
    setLeads((ls) => ls.filter((l) => l.id !== id))
    try {
      const res = await authFetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setLeads(prev)
      setError('No se pudo eliminar.')
    }
  }

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString('es-AR')
    } catch {
      return ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-cream">Clientes potenciales</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refresh}
            className="rounded-full border border-line px-4 py-1.5 text-xs tracking-wide text-muted transition-colors hover:border-gold hover:text-gold"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-gold px-4 py-1.5 text-xs font-medium tracking-wide text-ink transition-all hover:bg-cream"
          >
            {showForm ? 'Cancelar' : '+ Agregar'}
          </button>
        </div>
      </div>

      <p className="text-sm text-muted">
        Datos de cada persona que completó el formulario de contacto del sitio.
        Las consultas se guardan automáticamente desde ahora; también podés
        cargar clientes a mano.
      </p>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {showForm && (
        <form onSubmit={add} className="space-y-3 rounded-lg border border-line bg-ink-2 p-5">
          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" value={form.firstName} onChange={onField} placeholder="Nombre *" className={inputClass} />
            <input name="lastName" value={form.lastName} onChange={onField} placeholder="Apellido" className={inputClass} />
          </div>
          <input name="email" type="email" value={form.email} onChange={onField} placeholder="Email *" className={inputClass} />
          <input name="phone" type="tel" value={form.phone} onChange={onField} placeholder="Teléfono" className={inputClass} />
          <select
            name="service"
            value={form.service}
            onChange={onField}
            className={`${inputClass} ${form.service ? 'text-cream' : 'text-muted/60'}`}
          >
            <option value="">Servicio de interés</option>
            {SERVICE_KEYS.map((k) => (
              <option key={k} value={k} className="text-cream">
                {SERVICE_LABELS[k]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={adding}
            className="rounded-full bg-gold px-5 py-2 text-xs font-medium tracking-wide text-ink transition-all hover:bg-cream disabled:opacity-50"
          >
            {adding ? 'Agregando…' : 'Agregar cliente'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted">Cargando…</p>
      ) : leads.length === 0 ? (
        <p className="rounded-md border border-dashed border-line bg-ink-3 p-8 text-center text-sm text-muted">
          Todavía no hay clientes potenciales. Van a aparecer acá cuando alguien
          complete el formulario, o podés agregarlos a mano con "+ Agregar".
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {leads.length} {leads.length === 1 ? 'cliente' : 'clientes'}
          </p>
          {leads.map((l) => (
            <div
              key={l.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-line bg-ink-3 p-4"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium text-cream">
                  {`${l.firstName || ''} ${l.lastName || ''}`.trim() || '—'}
                  {l.source === 'manual' && (
                    <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-[0.6rem] uppercase tracking-wide text-muted">
                      manual
                    </span>
                  )}
                </p>
                <p className="break-words text-sm text-muted">
                  {l.email && (
                    <a href={`mailto:${l.email}`} className="hover:text-gold">{l.email}</a>
                  )}
                  {l.phone && (
                    <>
                      {' · '}
                      <a href={`tel:${l.phone}`} className="hover:text-gold">{l.phone}</a>
                    </>
                  )}
                </p>
                {l.service && (
                  <p className="text-xs text-muted">
                    Servicio: {SERVICE_LABELS[l.service] || l.service}
                  </p>
                )}
                <p className="text-xs text-muted/70">{fmtDate(l.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(l.id)}
                className="shrink-0 text-xs text-red-400 transition-colors hover:text-red-300"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
