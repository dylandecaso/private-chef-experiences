// Admin-only analytics: read the QR-scan counter (GET) or reset it (POST).
import { verifyAdmin } from '../_lib/verifyAdmin.js'
import { readAnalytics, writeAnalytics } from '../_lib/blobStore.js'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req, res)
  if (!admin) return

  try {
    if (req.method === 'GET') {
      const data = await readAnalytics()
      return res.status(200).json(data)
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (body?.action === 'reset') {
        await writeAnalytics({ qrScans: 0, updatedAt: new Date().toISOString() })
        return res.status(200).json({ qrScans: 0, updatedAt: null })
      }
      return res.status(400).json({ error: 'Unknown action' })
    }
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('admin/analytics error:', err)
    return res.status(500).json({ error: 'Failed to load analytics' })
  }
}
