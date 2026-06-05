// Verifies that a request comes from an authorized admin.
//
// Required env vars:
//   GOOGLE_CLIENT_ID   — the same Web Client ID used in the browser
//   ADMIN_EMAILS       — comma-separated whitelist of emails allowed to admin
//
// Usage in a handler:
//   import { verifyAdmin } from './_lib/verifyAdmin.js'
//   const admin = await verifyAdmin(req, res)
//   if (!admin) return  // verifyAdmin already wrote 401/403/500
//   // ...trusted: admin.email is in the whitelist
import { OAuth2Client } from 'google-auth-library'

let client

function getClient() {
  if (!client) client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  return client
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export async function verifyAdmin(req, res) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!token) {
    res.status(401).json({ error: 'Missing token' })
    return null
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500).json({ error: 'Server misconfigured: GOOGLE_CLIENT_ID' })
    return null
  }

  let payload
  try {
    const ticket = await getClient().verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    payload = ticket.getPayload()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
    return null
  }

  if (!payload?.email || !payload.email_verified) {
    res.status(401).json({ error: 'Email not verified' })
    return null
  }

  const admins = getAdminEmails()
  if (!admins.includes(payload.email.toLowerCase())) {
    res.status(403).json({ error: 'Not an admin' })
    return null
  }

  return { email: payload.email, name: payload.name, picture: payload.picture }
}
