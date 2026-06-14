// Tracking entry point for the business-card QR code. Every hit increments the
// QR-scan counter, then redirects the visitor to the homepage. Point the QR at
// https://<domain>/qr (rewritten to this function in vercel.json).
import { bumpQrScans } from './_lib/blobStore.js'

export default async function handler(req, res) {
  try {
    await bumpQrScans()
  } catch (err) {
    // Never let a tracking hiccup block the visitor — log and still redirect.
    console.error('qr track error:', err)
  }
  res.setHeader('Cache-Control', 'no-store, must-revalidate')
  res.setHeader('Location', '/')
  res.statusCode = 302
  res.end()
}
