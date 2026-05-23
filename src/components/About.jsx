import SafeImage from './SafeImage'

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Image — Replace public/images/about.jpg with a real portrait or
            kitchen shot of the chef. */}
        <div className="reveal">
          <div className="overflow-hidden rounded-lg border border-line">
            <SafeImage
              src="/images/about.jpg"
              alt="The private chef at work in the kitchen"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div className="reveal">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold">
            About
          </p>
          <h2 className="font-serif text-3xl leading-snug text-cream sm:text-4xl">
            Quality Ingredients.
            <br />
            Thoughtful Cuisine.
            <br />
            <span className="text-gold">Meaningful Moments.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Passionate culinary professional with experience in both kitchen
            and front-of-house roles. Trained in Argentina and developed
            professionally in the United States within high-level hospitality
            environments.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Highly motivated to grow as a Private Chef, bringing creativity,
            dedication, and a strong work ethic. Committed to delivering
            exceptional culinary experiences while continuously learning and
            evolving.
          </p>
          <a
            href="#experiences"
            className="mt-8 inline-block rounded-full border border-gold px-8 py-3.5 text-sm tracking-wide text-gold transition-all hover:bg-gold hover:text-ink"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  )
}
