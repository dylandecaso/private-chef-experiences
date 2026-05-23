import { useState } from 'react'
import SafeImage from './SafeImage'

// ============================================================
// GALLERY IMAGES — EDIT THIS ARRAY TO CHANGE THE GALLERY.
// Put the real gallery images inside: public/images/gallery/
//
// There are 27 photos (gallery-1.jpg ... gallery-27.jpg). They're generated
// automatically below. To change an image's caption, edit the `captions`
// object — anything without a custom caption gets a generic alt text.
//
// For a VIDEO instead of an image, add an entry by hand with type: 'video':
//   { type: 'video', src: '/images/gallery/clip-1.mp4', alt: 'Plating a dish' }
// ============================================================
const TOTAL_PHOTOS = 27

// Optional custom captions per photo number (used for accessibility / SEO).
const captions = {
  1: 'Private chef plating a dish',
  2: 'Elegant private dinner setup',
  3: 'Fresh seasonal ingredients',
}

const galleryImages = Array.from({ length: TOTAL_PHOTOS }, (_, i) => {
  const n = i + 1
  return {
    src: `/images/gallery/gallery-${n}.jpg`,
    alt: captions[n] || `Private chef experiences gallery photo ${n}`,
  }
})

// How many to show before the "View more" button.
const INITIAL_COUNT = 9

export default function Gallery() {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? galleryImages : galleryImages.slice(0, INITIAL_COUNT)

  return (
    <section id="gallery" className="bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center reveal">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold">
            A Taste Of The Work
          </p>
          <h2 className="font-serif text-3xl text-cream sm:text-4xl">
            Gallery
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {visible.map((item, i) => (
            <figure
              key={item.src + i}
              className="group relative overflow-hidden rounded-lg border border-line reveal"
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  className="aspect-square w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={item.alt}
                />
              ) : (
                <SafeImage
                  src={item.src}
                  alt={item.alt}
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              {/* subtle gold wash on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gold/0 transition-colors duration-500 group-hover:bg-gold/10" />
            </figure>
          ))}
        </div>

        {/* View more / less — only shown if there are more than INITIAL_COUNT */}
        {galleryImages.length > INITIAL_COUNT && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-full border border-gold px-8 py-3.5 text-sm tracking-wide text-gold transition-all hover:bg-gold hover:text-ink"
            >
              {expanded
                ? 'View Less'
                : `View More (${galleryImages.length - INITIAL_COUNT})`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
