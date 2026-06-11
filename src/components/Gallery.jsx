import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SafeImage from './SafeImage'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'

// Fallback shown when the blob's gallery array is empty. Keeps the site
// looking the same as before until the admin uploads real photos.
const FALLBACK_PHOTOS = Array.from({ length: 46 }, (_, i) => ({
  src: `/images/gallery/gallery-${i + 1}.jpg`,
  alt: `Emanuel Aciar private chef gallery photo ${i + 1}`,
}))

const INITIAL_COUNT = 6
const STEP = 6

export default function Gallery() {
  const { t } = useLanguage()
  const { content } = useContent()

  const galleryImages = useMemo(() => {
    const fromContent = (content.gallery || []).map((g) => ({
      src: g.url,
      alt: g.alt || 'Emanuel Aciar private chef gallery photo',
    }))
    return fromContent.length > 0 ? fromContent : FALLBACK_PHOTOS
  }, [content.gallery])

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const [activeIndex, setActiveIndex] = useState(null)

  const visible = galleryImages.slice(0, visibleCount)
  const hasMore = visibleCount < galleryImages.length
  const isOpen = activeIndex !== null

  // --- Lightbox controls ---------------------------------------------------
  const openAt = (index) => setActiveIndex(index)
  const close = useCallback(() => setActiveIndex(null), [])

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % galleryImages.length),
    [],
  )
  const prev = useCallback(
    () =>
      setActiveIndex(
        (i) => (i - 1 + galleryImages.length) % galleryImages.length,
      ),
    [],
  )

  // Keyboard navigation: ESC closes, arrows move.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close, next, prev])

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  // --- Touch swipe (mobile) ------------------------------------------------
  const touchStartX = useRef(null)
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) {
      if (delta < 0) next()
      else prev()
    }
    touchStartX.current = null
  }

  return (
    <section id="gallery" className="bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center reveal">
          <h2 className="font-serif text-3xl text-cream sm:text-4xl">{t('gallery.title')}</h2>
        </div>

        {/* Responsive grid: 2 cols (mobile) / 2 (tablet) / 3 (desktop) */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {visible.map((item, i) => (
            <button
              type="button"
              key={item.src}
              onClick={() => openAt(i)}
              aria-label={`${t('gallery.openImage')}: ${item.alt}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-line outline-none transition-all duration-300 hover:border-gold focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <SafeImage
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* dark + gold wash on hover */}
              <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
              {/* subtle zoom-icon cue */}
              <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 bg-ink/50 text-gold opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14zM10 7H9v2H7v1h2v2h1v-2h2V9h-2z" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        {/* Load More / end state */}
        <div className="mt-12 text-center">
          {hasMore ? (
            <button
              type="button"
              onClick={() =>
                setVisibleCount((c) => Math.min(c + STEP, galleryImages.length))
              }
              className="rounded-full border border-gold px-8 py-3.5 text-sm tracking-wide text-gold transition-all hover:bg-gold hover:text-ink"
            >
              {t('gallery.loadMore')}
            </button>
          ) : (
            galleryImages.length > INITIAL_COUNT && (
              <p className="text-sm uppercase tracking-[0.3em] text-muted">
                {t('gallery.noMore')}
              </p>
            )
          )}
        </div>
      </div>

      {/* ---------------------------- LIGHTBOX ---------------------------- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery.viewer')}
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label={t('gallery.close')}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
              <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z" />
            </svg>
          </button>

          {/* Prev arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label={t('gallery.prev')}
            className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold sm:left-6"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
              <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          {/* Image */}
          <figure
            className="mx-16 max-h-[85vh] max-w-[90vw] sm:mx-20"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={galleryImages[activeIndex].src}
              alt={galleryImages[activeIndex].alt}
              loading="eager"
              className="max-h-[80vh] w-auto rounded-lg border border-line object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-muted">
              {activeIndex + 1} / {galleryImages.length}
            </figcaption>
          </figure>

          {/* Next arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label={t('gallery.next')}
            className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold sm:right-6"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
              <path d="m10 6-1.41 1.41L13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
