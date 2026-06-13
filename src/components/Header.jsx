import { useEffect, useState } from 'react'
import { navLinks } from './navLinks'
import { useLanguage } from '../i18n/LanguageContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState('home')
  const { lang, setLang, t } = useLanguage()

  // Strengthen the glass background once the user scrolls past the hero top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scrollspy — highlight the nav link of the section currently crossing the
  // vertical middle of the viewport. rootMargin shrinks the observer root to a
  // thin centre band so exactly one section reads as "active" at a time.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter(Boolean)
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const isEN = lang === 'en'

  // Small EN / ES segmented pill — each language is its own button with
  // its own hover state. The active one stays highlighted. Colours adapt to
  // the header background: champagne over the dark hero, green once scrolled.
  const dark = !scrolled && !open
  const LangToggle = ({ className = '' }) => {
    const baseSeg =
      'rounded-full px-3 py-1.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2'
    const activeSeg = dark
      ? 'bg-champagne/15 text-champagne'
      : 'bg-green/10 text-green'
    const inactiveSeg = dark
      ? 'text-cream/70 hover:bg-cream/5 hover:text-champagne'
      : 'text-warm-muted hover:bg-green/5 hover:text-green'

    return (
      <div
        role="group"
        aria-label={t('nav.langToggleLabel')}
        className={`flex items-center gap-1 rounded-full border p-0.5 text-xs font-medium tracking-wider transition-colors ${
          dark
            ? 'border-hairline-light focus-visible:ring-champagne/60 hover:border-champagne/60'
            : 'border-hairline focus-visible:ring-green/40 hover:border-green/40'
        } ${className}`}
      >
        <button
          type="button"
          onClick={() => setLang('en')}
          aria-pressed={isEN}
          className={`${baseSeg} ${isEN ? activeSeg : inactiveSeg}`}
        >
          EN
        </button>
        <span
          aria-hidden="true"
          className={dark ? 'text-champagne/40' : 'text-hairline'}
        >
          |
        </span>
        <button
          type="button"
          onClick={() => setLang('es')}
          aria-pressed={!isEN}
          className={`${baseSeg} ${!isEN ? activeSeg : inactiveSeg}`}
        >
          ES
        </button>
      </div>
    )
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        open
          ? 'border-b border-hairline bg-paper/95 backdrop-blur-md'
          : scrolled
            ? 'border-b border-hairline bg-paper/95 backdrop-blur-md'
            : 'bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:gap-6 lg:px-6 xl:gap-8 xl:px-8"
        aria-label="Primary"
      >
        {/* Logo */}
        <a href="#home" className="group flex min-w-0 items-center gap-2.5 sm:gap-4">
          {/* Chef hat icon */}
          <svg
            viewBox="0 0 24 24"
            className={`h-8 w-8 shrink-0 transition-[transform,fill] duration-300 group-hover:scale-105 sm:h-10 sm:w-10 ${
              dark ? 'fill-champagne' : 'fill-green'
            }`}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12.5 1.5c-1.77 0-3.33 1.17-3.83 2.87C8.14 4.13 7.58 4 7 4a4 4 0 0 0-4 4a4.01 4.01 0 0 0 3 3.87V19h13v-7.13c1.76-.46 3-2.05 3-3.87a4 4 0 0 0-4-4c-.58 0-1.14.13-1.67.37c-.5-1.7-2.06-2.87-3.83-2.87m-.5 9h1v7h-1zm-3 2h1v5H9zm6 0h1v5h-1zM6 20v1a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-1z"
            />
          </svg>
          {/* thin hairline divider */}
          <span
            className={`h-8 w-px sm:h-10 ${dark ? 'bg-hairline-light' : 'bg-hairline'}`}
            aria-hidden="true"
          />
          <span className="flex min-w-0 flex-col gap-1 leading-none">
            <span
              className={`whitespace-nowrap font-serif text-[clamp(0.6rem,3vw,1.05rem)] font-medium tracking-normal sm:text-xl sm:tracking-[0.2em] ${
                dark ? 'text-cream' : 'text-green'
              }`}
            >
              {t('brand.name')}
            </span>
            <span
              className={`block whitespace-nowrap text-[clamp(0.34rem,1.6vw,0.65rem)] uppercase tracking-[0.04em] sm:tracking-[0.34em] lg:hidden xl:block ${
                dark ? 'text-champagne/90' : 'text-warm-muted'
              }`}
            >
              {t('brand.tagline')}
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-4 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={activeId === link.href.slice(1) ? 'page' : undefined}
                className={`whitespace-nowrap text-sm tracking-normal transition-colors xl:tracking-wide ${
                  activeId === link.href.slice(1)
                    ? dark
                      ? 'text-champagne'
                      : 'text-green'
                    : dark
                      ? 'text-cream/80 hover:text-champagne'
                      : 'text-warm-muted hover:text-green'
                }`}
              >
                {t(`nav.${link.key}`)}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right cluster: language toggle + CTA */}
        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          <LangToggle />
          <a
            href="#contact"
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs tracking-wide transition-all xl:px-6 xl:py-2.5 xl:text-sm ${
              dark
                ? 'border border-champagne text-cream hover:bg-champagne hover:text-green-deep'
                : 'border border-green text-green hover:bg-green hover:text-ink'
            }`}
          >
            {t('nav.bookCta')}
          </a>
        </div>

        {/* Mobile right cluster: language toggle + menu */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LangToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`flex h-11 w-11 items-center justify-center transition-colors ${
              dark ? 'text-cream' : 'text-green'
            }`}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
          >
            {open ? (
              /* Close (X) icon */
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 fill-current"
                aria-hidden="true"
              >
                <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 fill-current"
                aria-hidden="true"
              >
                <path d="M21 6a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h16a1 1 0 0 1 1 1m0 6a1 1 0 0 1-1 1H4a1 1 0 0 1 0-2h16a1 1 0 0 1 1 1m0 6a1 1 0 0 1-1 1H4a1 1 0 0 1 0-2h16a1 1 0 0 1 1 1" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`overflow-hidden bg-paper backdrop-blur-md transition-[max-height] duration-300 ease-out lg:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col px-5 py-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={activeId === link.href.slice(1) ? 'page' : undefined}
                className={`block border-b border-hairline py-3 text-sm tracking-wide transition-colors ${
                  activeId === link.href.slice(1)
                    ? 'text-green'
                    : 'text-warm-muted hover:text-green'
                }`}
              >
                {t(`nav.${link.key}`)}
              </a>
            </li>
          ))}
          <li className="py-3">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-block rounded-full border border-green px-6 py-2.5 text-sm tracking-wide text-green transition-all hover:bg-green hover:text-ink"
            >
              {t('nav.bookCta')}
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
