import SafeImage from './SafeImage'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'

export default function About() {
  const { lang } = useLanguage()
  const { content } = useContent()
  const about = content.about
  const pick = (field) => field?.[lang] ?? field?.en ?? ''

  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="reveal">
          <div className="overflow-hidden rounded-lg border border-line">
            <SafeImage
              src={about.imageUrl}
              alt={pick(about.eyebrow)}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>

        <div className="reveal">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold">
            {pick(about.eyebrow)}
          </p>
          <h2 className="font-serif text-3xl leading-snug text-cream sm:text-4xl">
            {pick(about.titleLine1)}
            <br />
            {pick(about.titleLine2)}
            <br />
            <span className="italic text-gold">{pick(about.titleLine3)}</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">{pick(about.p1)}</p>
          <p className="mt-4 text-base leading-relaxed text-muted">{pick(about.p2)}</p>
          <a
            href="#experiences"
            className="mt-8 inline-block rounded-full border border-gold px-8 py-3.5 text-sm tracking-wide text-gold transition-all hover:bg-gold hover:text-ink"
          >
            {pick(about.cta)}
          </a>
        </div>
      </div>
    </section>
  )
}
