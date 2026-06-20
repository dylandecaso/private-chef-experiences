import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'
import SectionDecor from './SectionDecor'

export default function FinalCTA() {
  const { lang } = useLanguage()
  const { content } = useContent()
  const finalCta = content.finalCta
  const pick = (field) => field?.[lang] ?? field?.en ?? ''

  return (
    <section className="relative overflow-hidden bg-ink py-28 lg:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/10 blur-[120px]" />
      <SectionDecor
        items={[
          { src: '/images/decor/3.png', className: 'left-4 top-10 hidden w-20 sm:block sm:w-28', rot: -10, opacity: 0.26, speed: 1.4, spin: 6 },
          { src: '/images/decor/5.png', className: 'bottom-10 right-[-1rem] w-24 sm:w-32', rot: 12, opacity: 0.3, speed: 1.9, spin: -8 },
        ]}
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
        <h2 className="font-serif text-3xl italic leading-snug text-cream sm:text-4xl lg:text-5xl reveal">
          {pick(finalCta.titleLine1)}{' '}
          <span className="italic text-champagne">{pick(finalCta.titleLine2)}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/80 reveal">
          {pick(finalCta.description)}
        </p>
        <a href="#contact" className="btn-hero mt-10 reveal">
          {pick(finalCta.cta)}
        </a>
      </div>
    </section>
  )
}
