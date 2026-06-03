import SafeImage from './SafeImage'
import { useLanguage } from '../i18n/LanguageContext'

export default function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Image — Replace public/images/about.jpg with a real portrait or
            kitchen shot of the chef. */}
        <div className="reveal">
          <div className="overflow-hidden rounded-lg border border-line">
            <SafeImage
              src="/images/about.jpg"
              alt={t('about.imageAlt')}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div className="reveal">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold">
            {t('about.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl leading-snug text-cream sm:text-4xl">
            {t('about.titleLine1')}
            <br />
            {t('about.titleLine2')}
            <br />
            <span className="text-gold">{t('about.titleLine3')}</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">
            {t('about.p1')}
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {t('about.p2')}
          </p>
          <a
            href="#experiences"
            className="mt-8 inline-block rounded-full border border-gold px-8 py-3.5 text-sm tracking-wide text-gold transition-all hover:bg-gold hover:text-ink"
          >
            {t('about.cta')}
          </a>
        </div>
      </div>
    </section>
  )
}
