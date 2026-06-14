import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'

const QR_URL = 'https://www.privatechef-experiences.com/qr'

export default function AnalyticsView() {
  const { authFetch } = useAuth()
  const [count, setCount] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/analytics')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCount(Number(data.qrScans) || 0)
      setUpdatedAt(data.updatedAt || null)
      setError('')
    } catch {
      setError('No se pudieron cargar las analíticas.')
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

  const reset = async () => {
    if (!window.confirm('¿Resetear el contador de escaneos a 0?')) return
    try {
      const res = await authFetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      })
      if (res.ok) {
        setCount(0)
        setUpdatedAt(null)
      } else {
        setError('No se pudo resetear.')
      }
    } catch {
      setError('No se pudo resetear.')
    }
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(QR_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-2xl text-cream">Visitas desde el QR</h2>

      {/* Contador de escaneos */}
      <div className="rounded-lg border border-line bg-ink-3 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Escaneos del código QR</p>
        <p className="mt-3 font-serif text-6xl text-gold">
          {loading ? '…' : (count ?? '—')}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Personas que entraron al sitio a través del QR de las tarjetas.
        </p>
        {updatedAt && (
          <p className="mt-1 text-xs text-muted/70">
            Último escaneo: {new Date(updatedAt).toLocaleString('es-AR')}
          </p>
        )}
        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={refresh}
            className="rounded-full border border-gold px-5 py-2 text-xs tracking-wide text-gold transition-all hover:bg-gold hover:text-ink"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-line px-5 py-2 text-xs tracking-wide text-muted transition-colors hover:border-red-400 hover:text-red-400"
          >
            Resetear contador
          </button>
        </div>
      </div>

      {/* Link del QR para las tarjetas */}
      <div className="rounded-lg border border-line bg-ink-2 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Link del código QR</p>
        <p className="mt-3 text-sm text-cream">
          Apuntá el QR de tus tarjetas a esta URL — cada escaneo suma +1 arriba y
          lleva a la persona al inicio del sitio:
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="rounded bg-ink-3 px-3 py-2 text-sm text-gold">{QR_URL}</code>
          <button
            type="button"
            onClick={copyUrl}
            className="rounded-full border border-gold px-4 py-1.5 text-xs text-gold transition-all hover:bg-gold hover:text-ink"
          >
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  )
}
