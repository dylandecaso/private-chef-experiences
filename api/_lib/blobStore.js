// Thin wrapper around @vercel/blob used by all admin endpoints.
//
// We keep the editable site content in a single JSON blob, and gallery
// images alongside it under the `gallery/` prefix. The JSON's `gallery`
// array stores { url, alt } objects in display order.
import { del, list, put } from '@vercel/blob'
import { randomUUID } from 'node:crypto'
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

// ── Contact-form leads ───────────────────────────────────────────────────
// Each contact-form submission (and any manually added lead) is appended here
// so it shows up in /admin → Clientes potenciales. Stored in a stable blob and
// capped so it can't grow without bound.
const LEADS_PATHNAME = 'leads.json'

async function findLeadsBlob() {
  const { blobs } = await list({ prefix: LEADS_PATHNAME })
  return blobs.find((b) => b.pathname === LEADS_PATHNAME) || null
}

export async function readLeads() {
  const blob = await findLeadsBlob()
  if (!blob) return []
  try {
    const res = await fetch(`${blob.url}?ts=${Date.now()}`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function writeLeads(leads) {
  await put(LEADS_PATHNAME, JSON.stringify(leads), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  })
}

const trim = (v, max) => (v == null ? '' : String(v).slice(0, max))

export async function addLead(lead) {
  const leads = await readLeads()
  const entry = {
    id: randomUUID(),
    firstName: trim(lead.firstName, 120),
    lastName: trim(lead.lastName, 120),
    email: trim(lead.email, 200),
    phone: trim(lead.phone, 60),
    service: trim(lead.service, 60),
    source: lead.source === 'manual' ? 'manual' : 'form',
    createdAt: new Date().toISOString(),
  }
  await writeLeads([entry, ...leads].slice(0, 2000)) // newest first, capped
  return entry
}

export async function deleteLead(id) {
  const leads = await readLeads()
  await writeLeads(leads.filter((l) => l.id !== id))
}
