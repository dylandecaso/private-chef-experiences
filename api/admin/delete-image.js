// Deletes a single blob (gallery image, hero video, about portrait, ...)
// from Vercel Blob storage. Caller passes the public URL.
// The content JSON is updated separately via /api/admin/content.
import { verifyAdmin } from '../_lib/verifyAdmin.js'
import { deleteBlobByUrl } from '../_lib/blobStore.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const admin = await verifyAdmin(req, res)
  if (!admin) return

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const url = body?.url
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing url' })
    }
    await deleteBlobByUrl(url)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('admin/delete-image error:', err)
    return res.status(500).json({ error: 'Delete failed' })
  }
}
