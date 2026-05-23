import SafeImage from './SafeImage'

// Replace each image in public/images/experiences/ with a real photo.
const experiences = [
  {
    src: '/images/experiences/intimate-dinners.jpg',
    title: 'Intimate Dinners',
    text: 'A refined dining experience for two, designed around your tastes.',
  },
  {
    src: '/images/experiences/family-gatherings.jpg',
    title: 'Family Gatherings',
    text: 'Warm, shared meals that bring everyone around the table.',
  },
  {
    src: '/images/experiences/special-celebrations.jpg',
    title: 'Special Celebrations',
    text: 'Custom menus to make milestones and occasions unforgettable.',
  },
  {
    src: '/images/experiences/wellness-cuisine.jpg',
    title: 'Wellness Cuisine',
    text: 'Nutritious, balanced dishes tailored to your lifestyle and goals.',
  },
]

export default function Experiences() {
  return (
    <section id="experiences" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center reveal">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold">
            Tailored For Every Occasion
          </p>
          <h2 className="font-serif text-3xl text-cream sm:text-4xl">
            Experiences
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((exp) => (
            <article
              key={exp.title}
              className="group relative overflow-hidden rounded-lg border border-line reveal"
            >
              <SafeImage
                src={exp.src}
                alt={exp.title}
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* gradient + text overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-xl text-cream">{exp.title}</h3>
                <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-muted opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                  {exp.text}
                </p>
                <span className="mt-3 block h-px w-10 bg-gold transition-all duration-500 group-hover:w-16" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
