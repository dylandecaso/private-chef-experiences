import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'

const icons = {
  dinner: (
    <path d="M3 3v8a3 3 0 0 0 3 3v7M6 3v6M9 3v6M9 3v8m9-8c-1.7 0-3 2.2-3 5s1.3 4 3 4v6" />
  ),
  prep: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 4v5M3 14h7M3 17h5" />
    </>
  ),
  events: (
    <path d="M12 3v3m0 0a6 6 0 0 0-6 6c0 2 1 3 3 3h6c2 0 3-1 3-3a6 6 0 0 0-6-6Zm-5 12h10M9 21h6" />
  ),
  healthy: (
    <path d="M12 21c-5-3-8-6.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 4.5-3 8-8 11Z" />
  ),
  home: <path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6" />,
}

export default function Services() {
  const { lang } = useLanguage()
  const { content } = useContent()
  const services = content.services
  const pick = (field) => field?.[lang] ?? field?.en ?? ''

  return (
    <section id="services" className="paper-texture py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center reveal">
          <div className="flex items-center justify-center gap-4">
            <span className="hidden h-px w-10 bg-hairline sm:block" aria-hidden="true" />
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-warm-muted sm:text-xs">
              What We Offer
            </p>
            <span className="hidden h-px w-10 bg-hairline sm:block" aria-hidden="true" />
          </div>
          <h2 className="mt-6 font-serif text-3xl italic text-green sm:text-4xl lg:text-5xl">{pick(services.title)}</h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s, i) => (
            <div key={s.id} className="reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="service-card group h-full rounded-xl border border-hairline bg-white/[0.04] p-8 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.5)] transition-colors hover:border-green/40">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-hairline text-green transition-colors group-hover:border-green">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    {icons[s.icon] || icons.dinner}
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-charcoal">{pick(s.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-muted">{pick(s.text)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
