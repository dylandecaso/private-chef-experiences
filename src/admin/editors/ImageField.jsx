import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { useAuth } from '../AuthContext'

// Renders a preview + replace button. On replace, uploads directly to
// Vercel Blob (the token is fetched from /api/admin/upload which validates
// the admin first) and reports the new URL back via onChange.
export default function ImageField({
  label,
  value,
  onChange,
  accept = 'image/*',
  hint,
}) {
  const { token } = useAuth()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function onPick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        clientPayload: JSON.stringify({ kind: label }),
        // Forward our admin JWT so the server can verifyAdmin before issuing
        // a client upload token.
        // (@vercel/blob/client uses fetch, which honors these headers.)
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      onChange(blob.url)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  // Detect by accept prop first (driven by the editor's intent) and fall
  // back to the URL extension. Tolerant of Blob URLs with query strings
  // or random suffixes appended by Vercel.
  const isAudioAccept = accept.startsWith('audio/')
  const isVideoAccept = accept.startsWith('video/')
  const isAudio =
    isAudioAccept || /\.(mp3|m4a|aac|wav|ogg|oga|weba)(\?|$)/i.test(value || '')
  const isVideo =
    !isAudio && (isVideoAccept || /\.(mp4|webm|mov)(\?|$)/i.test(value || ''))

  const emptyLabel = isAudio ? 'No audio' : isVideo ? 'No video' : 'No image'

  return (
    <div>
      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <div className="overflow-hidden rounded-md border border-line bg-ink-3">
        {value ? (
          isAudio ? (
            <div className="flex h-40 items-center justify-center px-3">
              <audio src={value} controls preload="none" className="w-full" />
            </div>
          ) : isVideo ? (
            <video src={value} className="h-40 w-full object-cover" muted playsInline />
          ) : (
            <img src={value} alt="" className="h-40 w-full object-cover" />
          )
        ) : (
          <div className="flex h-40 items-center justify-center text-xs text-muted">
            {emptyLabel}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full border border-gold px-4 py-1.5 text-xs tracking-wide text-gold transition-all hover:bg-gold hover:text-ink disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
        </button>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted underline hover:text-gold"
          >
            View
          </a>
        )}
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onPick}
        className="hidden"
      />
    </div>
  )
}
