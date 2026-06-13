import SafeImage from './SafeImage'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'

export default function Experiences() {
  const { lang } = useLanguage()
  const { content } = useContent()
  const experiences = content.experiences
  const pick = (field) => field?.[lang] ?? field?.en ?? ''

  return (
    <section id="experiences" className="bg-paper-2 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center reveal">
          {/* Editorial label, flanked by thin hairlines */}
          <div className="flex items-center justify-center gap-4">
            <span className="hidden h-px w-10 bg-hairline sm:block" aria-hidden="true" />
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-warm-muted sm:text-xs">
              Curated Experiences
            </p>
            <span className="hidden h-px w-10 bg-hairline sm:block" aria-hidden="true" />
          </div>
          <h2 className="mt-6 font-serif text-3xl italic text-green sm:text-4xl lg:text-5xl">
            {pick(experiences.title)}
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.items.map((exp, i) => {
            const title = pick(exp.title)
            const text = pick(exp.text)
            return (
              <article
                key={exp.id}
                className="group relative overflow-hidden rounded-xl border border-hairline shadow-[0_18px_50px_-30px_rgba(36,56,31,0.35)] transition-all duration-300 hover:border-champagne reveal"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <SafeImage
                  src={exp.imageUrl}
                  alt={title}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-deep via-green-deep/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-serif text-xl italic text-cream">{title}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-cream/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                    {text}
                  </p>
                  <span className="mt-3 block h-px w-10 bg-champagne transition-all duration-500 group-hover:w-16" />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
