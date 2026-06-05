// Single source of truth for the nav links, shared by Header and Footer.
// `href` points to a section id on this one page (no router / no extra pages).
// `key` maps to the translations file (src/i18n/translations.js → nav.*).
export const navLinks = [
  { key: 'home', href: '#home' },
  { key: 'services', href: '#services' },
  { key: 'experiences', href: '#experiences' },
  { key: 'gallery', href: '#gallery' },
  { key: 'contact', href: '#contact' },
]
