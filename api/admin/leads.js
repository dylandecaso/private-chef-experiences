// Admin-only leads: list contact-form submissions (GET), add one manually, or
// delete one (POST with an action).
import { verifyAdmin } from '../_lib/verifyAdmin.js'
import { readLeads, addLead, deleteLead } from '../_lib/blobStore.js'

export default async function handler(req, res) {
  const admin = await verifyAdmin(req, res)
  if (!admin) return

  try {
    if (req.method === 'GET') {
      const leads = await readLeads()
      return res.status(200).json({ leads })
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (body?.action === 'add') {
        const lead = await addLead({ ...(body.lead || {}), source: 'manual' })
        return res.status(200).json({ lead })
      }
      if (body?.action === 'delete' && body?.id) {
        await deleteLead(body.id)
        return res.status(200).json({ ok: true })
      }
      return res.status(400).json({ error: 'Unknown action' })
    }
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('admin/leads error:', err)
    return res.status(500).json({ error: 'Failed to load leads' })
  }
}
