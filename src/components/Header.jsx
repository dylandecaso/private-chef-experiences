import { useEffect, useState } from 'react'
import { navLinks } from './navLinks'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Strengthen the glass background once the user scrolls past the hero top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-line bg-ink/80 backdrop-blur-md'
          : 'border-transparent bg-ink/20 backdrop-blur-sm'
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
        aria-label="Primary"
      >
        {/* Logo */}
        <a href="#home" className="group flex items-center gap-3 sm:gap-4">
          {/* Chef hat icon */}
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9 shrink-0 fill-gold transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12.5 1.5c-1.77 0-3.33 1.17-3.83 2.87C8.14 4.13 7.58 4 7 4a4 4 0 0 0-4 4a4.01 4.01 0 0 0 3 3.87V19h13v-7.13c1.76-.46 3-2.05 3-3.87a4 4 0 0 0-4-4c-.58 0-1.14.13-1.67.37c-.5-1.7-2.06-2.87-3.83-2.87m-.5 9h1v7h-1zm-3 2h1v5H9zm6 0h1v5h-1zM6 20v1a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-1z"
            />
          </svg>
          {/* thin gold divider */}
          <span className="h-9 w-px bg-line sm:h-10" aria-hidden="true" />
          <span className="flex flex-col gap-1 leading-none">
            <span className="font-serif text-lg font-medium tracking-[0.2em] text-cream sm:text-xl">
              EMANUEL ACIAR
            </span>
            <span className="text-[0.55rem] uppercase tracking-[0.34em] text-gold/90 sm:text-[0.65rem]">
              Private Chef Experiences
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm tracking-wide text-muted transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="hidden rounded-full border border-gold px-6 py-2.5 text-sm tracking-wide text-gold transition-all hover:bg-gold hover:text-ink lg:inline-block"
        >
          Book an Experience
        </a>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-cream lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-6 bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-6 bg-current transition-transform duration-300 ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`overflow-hidden border-t border-line bg-ink/95 backdrop-blur-md transition-[max-height] duration-300 ease-out lg:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col px-5 py-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm tracking-wide text-muted transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="py-3">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-block rounded-full border border-gold px-6 py-2.5 text-sm tracking-wide text-gold transition-all hover:bg-gold hover:text-ink"
            >
              Book an Experience
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
