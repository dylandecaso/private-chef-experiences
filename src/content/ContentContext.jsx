import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultContent } from './defaultContent'

// One source of truth for the editable site content. On mount we fetch
// /api/content from the Blob; if that fails we ship the bundled defaults
// so the site still renders.
const ContentContext = createContext({
  content: defaultContent,
  loading: true,
  refresh: async () => {},
  setContent: () => {},
})

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data === 'object') setContent(data)
      }
    } catch {
      // keep current content (defaults or whatever was loaded)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ content, loading, refresh, setContent }),
    [content, loading, refresh],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}
