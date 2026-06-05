// Admin write endpoint for the site content JSON.
// PUT body: the full content object. We trust the admin to send valid shape;
// the editor in the UI is the source of truth for structure.
import { verifyAdmin } from '../_lib/verifyAdmin.js'
import { readSiteContent, writeSiteContent } from '../_lib/blobStore.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const admin = await verifyAdmin(req, res)
    if (!admin) return
    try {
      const content = await readSiteContent()
      return res.status(200).json(content)
    } catch (err) {
      console.error('admin/content GET error:', err)
      return res.status(500).json({ error: 'Failed to read content' })
    }
  }

  if (req.method === 'PUT') {
    const admin = await verifyAdmin(req, res)
    if (!admin) return
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Body must be a content object' })
      }
      await writeSiteContent(body)
      return res.status(200).json({ ok: true })
    } catch (err) {
      console.error('admin/content PUT error:', err)
      return res.status(500).json({ error: 'Failed to write content' })
    }
  }

  res.setHeader('Allow', 'GET, PUT')
  return res.status(405).json({ error: 'Method not allowed' })
}
