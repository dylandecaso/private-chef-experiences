const highlights = [
  {
    title: 'Fresh Ingredients',
    text: 'Sourced with care — premium, high-quality produce in every dish.',
  },
  {
    title: 'Seasonal Menus',
    text: 'Menus that follow the seasons for peak flavor and freshness.',
  },
  {
    title: 'Refined Simplicity',
    text: 'Clean flavors and balanced dishes — comforting yet refined.',
  },
]

export default function CulinaryStyle() {
  return (
    <section className="bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center reveal">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold">
            Philosophy
          </p>
          <h2 className="font-serif text-3xl text-cream sm:text-4xl">
            Culinary Style
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Italian and Mediterranean cuisine focused on fresh, high-quality
            ingredients and simplicity. Emphasis on seasonal products, clean
            flavors, and balanced dishes — creating food that is both
            comforting and refined.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {highlights.map((h, i) => (
            <div
              key={h.title}
              className="rounded-lg border border-line bg-ink-3 p-8 text-center reveal"
            >
              <span className="font-serif text-3xl text-gold/40">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-serif text-xl text-cream">{h.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {h.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
