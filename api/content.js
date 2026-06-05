// Public read of the site content. Used by the React app on first load.
// Falls back to the bundled default content if the blob is unreachable.
import { readSiteContent } from './_lib/blobStore.js'
import { defaultContent } from '../src/content/defaultContent.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const content = await readSiteContent()
    // 60s edge cache + revalidate — fast for visitors, fresh after edits.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return res.status(200).json(content)
  } catch (err) {
    console.error('content GET error:', err)
    return res.status(200).json(defaultContent)
  }
}
