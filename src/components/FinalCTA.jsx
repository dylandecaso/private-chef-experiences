import { useLanguage } from '../i18n/LanguageContext'

export default function FinalCTA() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden py-28 lg:py-36">
      {/* faint radial gold glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
        <h2 className="font-serif text-3xl leading-snug text-cream sm:text-4xl lg:text-5xl reveal">
          {t('finalCta.titleLine1')}{' '}
          <span className="text-gold">{t('finalCta.titleLine2')}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted reveal">
          {t('finalCta.description')}
        </p>
        <a
          href="#contact"
          className="mt-10 inline-block rounded-full bg-gold px-10 py-4 text-sm font-medium tracking-wide text-ink transition-all hover:bg-cream reveal"
        >
          {t('finalCta.cta')}
        </a>
      </div>
    </section>
  )
}
