// Thin wrapper around @vercel/blob used by all admin endpoints.
//
// We keep the editable site content in a single JSON blob, and gallery
// images alongside it under the `gallery/` prefix. The JSON's `gallery`
// array stores { url, alt } objects in display order.
import { del, list, put } from '@vercel/blob'
import { defaultContent } from '../../src/content/defaultContent.js'

const CONTENT_PATHNAME = 'site-content.json'

async function findContentBlob() {
  const { blobs } = await list({ prefix: CONTENT_PATHNAME })
  return blobs.find((b) => b.pathname === CONTENT_PATHNAME) || null
}

export async function readSiteContent() {
  const blob = await findContentBlob()
  if (!blob) return defaultContent
  // Cache-bust because list() returns a CDN URL and we just wrote it.
  const res = await fetch(`${blob.url}?ts=${Date.now()}`)
  if (!res.ok) return defaultContent
  try {
    const parsed = await res.json()
    return mergeWithDefaults(parsed)
  } catch {
    return defaultContent
  }
}

// Shallow-merge unknown sections so old blobs survive new fields being added.
function mergeWithDefaults(parsed) {
  const out = { ...defaultContent, ...parsed }
  for (const key of Object.keys(defaultContent)) {
    if (
      parsed[key] &&
      typeof parsed[key] === 'object' &&
      !Array.isArray(parsed[key]) &&
      typeof defaultContent[key] === 'object' &&
      !Array.isArray(defaultContent[key])
    ) {
      out[key] = { ...defaultContent[key], ...parsed[key] }
    }
  }
  // If the stored gallery is missing or empty, fall back to the bundled default
  // gallery so the site AND the /admin editor start from the seeded photos
  // instead of an empty grid. Once the admin saves a non-empty gallery, that
  // saved list takes over.
  if (!Array.isArray(out.gallery) || out.gallery.length === 0) {
    out.gallery = defaultContent.gallery
  }
  return out
}

export async function writeSiteContent(content) {
  // allowOverwrite + addRandomSuffix:false → stable URL, single canonical file.
  await put(CONTENT_PATHNAME, JSON.stringify(content), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  })
}

export async function putGalleryImage(filename, body, contentType) {
  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, '-')
  const path = `gallery/${Date.now()}-${safeName}`
  const result = await put(path, body, {
    access: 'public',
    contentType,
    addRandomSuffix: true,
  })
  return result.url
}

export async function deleteBlobByUrl(url) {
  await del(url)
}

// ── QR / visit analytics ────────────────────────────────────────────────
// A tiny counter blob, kept separate from the site content. Read-modify-write
// isn't atomic, but business-card QR traffic is low enough that the rare lost
// increment under simultaneous scans is acceptable.
const ANALYTICS_PATHNAME = 'analytics.json'

async function findAnalyticsBlob() {
  const { blobs } = await list({ prefix: ANALYTICS_PATHNAME })
  return blobs.find((b) => b.pathname === ANALYTICS_PATHNAME) || null
}

export async function readAnalytics() {
  const blob = await findAnalyticsBlob()
  if (!blob) return { qrScans: 0, updatedAt: null }
  try {
    const res = await fetch(`${blob.url}?ts=${Date.now()}`)
    if (!res.ok) return { qrScans: 0, updatedAt: null }
    const data = await res.json()
    return { qrScans: Number(data?.qrScans) || 0, updatedAt: data?.updatedAt || null }
  } catch {
    return { qrScans: 0, updatedAt: null }
  }
}

export async function writeAnalytics(data) {
  await put(ANALYTICS_PATHNAME, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  })
}

export async function bumpQrScans() {
  const current = await readAnalytics()
  const qrScans = (Number(current.qrScans) || 0) + 1
  await writeAnalytics({ qrScans, updatedAt: new Date().toISOString() })
  return qrScans
}
