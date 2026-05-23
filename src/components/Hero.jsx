import SafeImage from './SafeImage'

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center">
      {/* Background image — Replace public/images/hero.jpg with a real photo
          of the chef cooking, plating, or a premium dish. */}
      <SafeImage
        src="/images/hero.png"
        alt="Mediterranean feast of shared dishes on a table"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />

      {/* Dark overlays for legible text:
          - vertical fade so it blends into the next section
          - left-to-right fade so the headline (on the left) stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-5 py-32 lg:px-8">
        <div className="max-w-2xl reveal">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-gold">
            Italian &amp; Mediterranean Cuisine
          </p>
          <h1 className="font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            Exceptional Cuisine.
            <br />
            <span className="text-gold">Personalized For You.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Elevated culinary experiences in the comfort of your home. Crafted
            with premium ingredients, thoughtful menus, and a personal approach
            designed around your tastes, needs, and special moments.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              className="rounded-full bg-gold px-8 py-3.5 text-center text-sm font-medium tracking-wide text-ink transition-all hover:bg-cream"
            >
              Book Your Experience
            </a>
            <a
              href="#services"
              className="rounded-full border border-line px-8 py-3.5 text-center text-sm tracking-wide text-cream transition-all hover:border-gold hover:text-gold"
            >
              View Services
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
