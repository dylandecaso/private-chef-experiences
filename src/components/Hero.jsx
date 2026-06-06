import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'

// Bilingual fallbacks for the CTA copy. The eyebrow + CTA are the only
// text on the Hero now, so we keep the button label inline (not in
// translations.js) — they belong to this section, not the whole site.
const CTA_LABEL = {
  en: 'Book an Experience',
  es: 'Reservar Experiencia',
}

export default function Hero() {
  const { lang } = useLanguage()
  const { content } = useContent()
  const hero = content.hero
  const pick = (field) => field?.[lang] ?? field?.en ?? ''
  const cta = CTA_LABEL[lang === 'es' ? 'es' : 'en']

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* object-left anchors the left edge (the chef) so narrower screens
          crop from the right instead of cutting into the chef. */}
      <video
        className="absolute inset-0 h-full w-full object-cover object-left"
        src={hero.videoUrl}
        poster={hero.posterUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Even fade across the whole Hero — the text is centered now, so we
          drop the side gradient that used to darken the left half. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
      <div className="absolute inset-0 bg-ink/35" />

      <div className="relative mx-auto w-full max-w-3xl px-5 text-center reveal lg:px-8">
        <p className="text-sm uppercase tracking-[0.4em] text-gold sm:text-base">
          {pick(hero.eyebrow)}
        </p>
        <a
          href="#contact"
          className="hero-cta mt-10 inline-block rounded-full px-10 py-4 text-sm font-medium tracking-wide sm:text-base"
        >
          {cta}
        </a>
      </div>
    </section>
  )
}
