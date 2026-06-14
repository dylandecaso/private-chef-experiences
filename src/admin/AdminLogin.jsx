import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from './AuthContext'

export default function AdminLogin() {
  const { loginWithCredential } = useAuth()
  const [error, setError] = useState('')

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-ink-2 p-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">
          Private Chef
        </p>
        <h1 className="mt-3 font-serif text-3xl text-cream">Panel de administración</h1>
        <p className="mt-4 text-sm text-muted">
          Iniciá sesión con la cuenta de Google autorizada para editar el sitio.
        </p>

        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={(resp) => {
              setError('')
              if (resp?.credential) loginWithCredential(resp.credential)
            }}
            onError={() => setError('No se pudo iniciar sesión. Probá de nuevo.')}
            theme="filled_black"
            shape="pill"
            text="continue_with"
          />
        </div>

        {error && (
          <p className="mt-4 text-xs text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}
