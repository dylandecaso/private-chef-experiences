import SafeImage from './SafeImage'
import { useLanguage } from '../i18n/LanguageContext'

// Replace each image in public/images/experiences/ with a real photo.
const experiences = [
  {
    src: '/images/experiences/intimate-dinners.jpg',
    titleKey: 'intimateTitle',
    textKey: 'intimateText',
  },
  {
    src: '/images/experiences/family-gatherings.jpg',
    titleKey: 'familyTitle',
    textKey: 'familyText',
  },
  {
    src: '/images/experiences/special-celebrations.jpg',
    titleKey: 'celebrationsTitle',
    textKey: 'celebrationsText',
  },
  {
    src: '/images/experiences/wellness-cuisine.jpg',
    titleKey: 'wellnessTitle',
    textKey: 'wellnessText',
  },
]

export default function Experiences() {
  const { t } = useLanguage()

  return (
    <section id="experiences" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center reveal">
          <h2 className="font-serif text-3xl text-cream sm:text-4xl">
            {t('experiences.title')}
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((exp) => {
            const title = t(`experiences.items.${exp.titleKey}`)
            const text = t(`experiences.items.${exp.textKey}`)
            return (
              <article
                key={exp.titleKey}
                className="group relative overflow-hidden rounded-lg border border-line reveal"
              >
                <SafeImage
                  src={exp.src}
                  alt={title}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* gradient + text overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-serif text-xl text-cream">{title}</h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-muted opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                    {text}
                  </p>
                  <span className="mt-3 block h-px w-10 bg-gold transition-all duration-500 group-hover:w-16" />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
