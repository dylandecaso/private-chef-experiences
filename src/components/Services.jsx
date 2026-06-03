import { useLanguage } from '../i18n/LanguageContext'

// Simple line icons (stroke = currentColor so they inherit the gold accent).
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

const services = [
  { icon: 'dinner', titleKey: 'dinnerTitle', textKey: 'dinnerText' },
  { icon: 'prep', titleKey: 'prepTitle', textKey: 'prepText' },
  { icon: 'events', titleKey: 'eventsTitle', textKey: 'eventsText' },
  { icon: 'healthy', titleKey: 'healthyTitle', textKey: 'healthyText' },
  { icon: 'home', titleKey: 'homeTitle', textKey: 'homeText' },
]

export default function Services() {
  const { t } = useLanguage()

  return (
    <section id="services" className="bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center reveal">
          <h2 className="font-serif text-3xl text-cream sm:text-4xl">
            {t('services.title')}
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.titleKey}
              className="group rounded-lg border border-line bg-ink-3 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold reveal"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-line text-gold transition-colors group-hover:border-gold">
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
                  {icons[s.icon]}
                </svg>
              </div>
              <h3 className="font-serif text-xl text-cream">
                {t(`services.items.${s.titleKey}`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t(`services.items.${s.textKey}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
