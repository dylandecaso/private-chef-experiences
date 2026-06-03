import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key,
})

const STORAGE_KEY = 'site-lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'es' || saved === 'en' ? saved : 'en'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => {
    const dict = translations[lang] || translations.en
    const t = (key) => {
      const value = key.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object') return acc[part]
        return undefined
      }, dict)
      if (value === undefined) {
        const fallback = key.split('.').reduce((acc, part) => {
          if (acc && typeof acc === 'object') return acc[part]
          return undefined
        }, translations.en)
        return fallback ?? key
      }
      return value
    }
    return {
      lang,
      setLang,
      toggleLang: () => setLang((l) => (l === 'en' ? 'es' : 'en')),
      t,
    }
  }, [lang])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
