import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/LanguageContext'
import { useDocumentMeta } from '../lib/useDocumentMeta'

// Shared layout for the standalone legal pages (Privacy Policy, Terms &
// Conditions). Reuses the brand styling (ink/gold/cream, Playfair + Inter) and
// the site Footer, with a slim branded top bar instead of the section-anchor
// header (those anchors don't exist on these routes). Long-form typography is
// styled via the `.legal-content` rules in index.css.
export default function LegalPage({
  metaTitle,
  metaDescription,
  eyebrow,
  title,
  updated,
  children,
}) {
  const { t } = useLanguage()
  useDocumentMeta(metaTitle, metaDescription)

  // Start each legal page at the top (React Router doesn't auto-scroll).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 shrink-0 fill-gold transition-transform duration-300 group-hover:scale-105"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12.5 1.5c-1.77 0-3.33 1.17-3.83 2.87C8.14 4.13 7.58 4 7 4a4 4 0 0 0-4 4a4.01 4.01 0 0 0 3 3.87V19h13v-7.13c1.76-.46 3-2.05 3-3.87a4 4 0 0 0-4-4c-.58 0-1.14.13-1.67.37c-.5-1.7-2.06-2.87-3.83-2.87m-.5 9h1v7h-1zm-3 2h1v5H9zm6 0h1v5h-1zM6 20v1a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-1z"
              />
            </svg>
            <span className="truncate font-serif text-base font-medium tracking-[0.18em] text-cream sm:text-lg sm:tracking-[0.2em]">
              {t('brand.name')}
            </span>
          </Link>
          <Link
            to="/"
            className="shrink-0 whitespace-nowrap text-xs tracking-wide text-muted transition-colors hover:text-gold sm:text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="bg-ink">
        <div className="mx-auto max-w-4xl px-5 pb-10 pt-16 lg:px-8 lg:pt-24">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-muted">Last updated: {updated}</p>
          <span className="mt-8 block h-px w-16 bg-gold" aria-hidden="true" />
        </div>

        <div className="legal-content mx-auto max-w-3xl px-5 pb-24 lg:px-8 lg:pb-32">
          {children}
        </div>
      </main>

      <Footer />
    </>
  )
}
