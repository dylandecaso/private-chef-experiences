import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'

export default function Hero() {
  const { lang } = useLanguage()
  const { content } = useContent()
  const hero = content.hero
  const pick = (field) => field?.[lang] ?? field?.en ?? ''

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover object-right"
        src={hero.videoUrl}
        poster={hero.posterUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent lg:from-ink/85 lg:via-ink/20" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-28 lg:px-8 lg:py-32">
        <div className="max-w-xl reveal lg:ml-0 lg:mr-auto lg:w-[48%] lg:max-w-none">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-gold">
            {pick(hero.eyebrow)}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            {pick(hero.titleLine1)}
            <br />
            <span className="italic text-gold">{pick(hero.titleLine2)}</span>
          </h1>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted sm:text-lg">
            <p>{pick(hero.p1)}</p>
            <p>{pick(hero.p2)}</p>
            <p>{pick(hero.p3)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
