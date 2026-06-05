// Issues short-lived client upload tokens so the admin browser can upload
// directly to Vercel Blob without proxying the bytes through this function.
// Only admins (validated via verifyAdmin) can request a token.
import { handleUpload } from '@vercel/blob/client'
import { verifyAdmin } from '../_lib/verifyAdmin.js'

export const config = { api: { bodyParser: true } }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Gate the upload on a valid admin token before issuing the client token.
  const admin = await verifyAdmin(req, res)
  if (!admin) return

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const jsonResponse = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/avif',
          'image/gif',
          'video/mp4',
          'video/webm',
        ],
        maximumSizeInBytes: 50 * 1024 * 1024, // 50 MB cap
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ admin: admin.email, pathname }),
      }),
      onUploadCompleted: async ({ blob }) => {
        // Hook for future bookkeeping; we update the content JSON from the
        // client right after upload, so nothing to do here yet.
        console.log('admin upload completed:', blob.url)
      },
    })
    return res.status(200).json(jsonResponse)
  } catch (err) {
    console.error('admin/upload error:', err)
    return res.status(500).json({ error: err.message || 'Upload failed' })
  }
}
