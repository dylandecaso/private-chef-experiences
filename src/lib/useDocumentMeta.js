import { useEffect } from 'react'

// Lightweight per-route SEO metadata for this client-rendered SPA (no
// react-helmet dependency). Sets document.title and the <meta name="description">
// content while the page is mounted, and restores the previous values on unmount
// so navigating back to the home page keeps the original site metadata.
export function useDocumentMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title

    const metaEl = document.querySelector('meta[name="description"]')
    const prevDescription = metaEl ? metaEl.getAttribute('content') : null
    if (metaEl && description) metaEl.setAttribute('content', description)

    return () => {
      document.title = prevTitle
      if (metaEl && prevDescription !== null) {
        metaEl.setAttribute('content', prevDescription)
      }
    }
  }, [title, description])
}
