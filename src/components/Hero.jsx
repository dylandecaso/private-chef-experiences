import { useLanguage } from '../i18n/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover object-right"
        src="/videos/hero-desktop.mp4"
        poster="/images/hero1.png"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Overlays for text legibility:
          - vertical fade so it blends into the next section
          - subtle left-side darkening behind the text */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent lg:from-ink/85 lg:via-ink/20" />

      {/* Content — text on the left half */}
      <div className="relative mx-auto w-full max-w-7xl px-5 py-28 lg:px-8 lg:py-32">
        <div className="max-w-xl reveal lg:ml-0 lg:mr-auto lg:w-[48%] lg:max-w-none">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-gold">
            {t('hero.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            {t('hero.titleLine1')}
            <br />
            <span className="text-gold">{t('hero.titleLine2')}</span>
          </h1>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted sm:text-lg">
            <p>{t('hero.p1')}</p>
            <p>{t('hero.p2')}</p>
            <p>{t('hero.p3')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
