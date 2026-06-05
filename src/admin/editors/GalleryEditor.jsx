import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { useAuth } from '../AuthContext'

export default function GalleryEditor({ value, onChange }) {
  const items = value || []
  const { token, authFetch } = useAuth()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function onPick(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setError('')
    setUploading(true)
    try {
      const uploaded = []
      for (const file of files) {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/upload',
          clientPayload: JSON.stringify({ kind: 'gallery' }),
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        uploaded.push({ url: blob.url, alt: '' })
      }
      onChange([...items, ...uploaded])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function onDelete(idx) {
    const img = items[idx]
    onChange(items.filter((_, i) => i !== idx))
    // Best-effort blob cleanup so we don't leak storage.
    try {
      await authFetch('/api/admin/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: img.url }),
      })
    } catch {
      // already removed from the JSON; orphan blob is acceptable
    }
  }

  function move(idx, dir) {
    const next = [...items]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next)
  }

  function setAlt(idx, alt) {
    const next = [...items]
    next[idx] = { ...next[idx], alt }
    onChange(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-cream">Gallery</h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full bg-gold px-5 py-2 text-xs font-medium tracking-wide text-ink transition-all hover:bg-cream disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : '+ Add photos'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onPick}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {items.length === 0 && (
        <p className="rounded-md border border-dashed border-line bg-ink-3 p-8 text-center text-sm text-muted">
          No photos yet. Click "Add photos" to upload.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <div key={item.url} className="overflow-hidden rounded-md border border-line bg-ink-3">
            <div className="relative aspect-square overflow-hidden">
              <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
              <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[0.6rem] tracking-widest text-gold">
                {idx + 1}
              </span>
            </div>
            <div className="space-y-2 p-3">
              <input
                type="text"
                value={item.alt}
                onChange={(e) => setAlt(idx, e.target.value)}
                placeholder="Alt text (optional)"
                className="w-full rounded-md border border-line bg-ink-2 px-2 py-1.5 text-xs text-cream placeholder-muted/50 outline-none focus:border-gold"
              />
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="text-muted hover:text-gold disabled:opacity-30"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="text-muted hover:text-gold disabled:opacity-30"
                  >
                    ▶
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(idx)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
