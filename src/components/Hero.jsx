import { useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'

// Bilingual fallbacks for the CTA copy. The eyebrow + CTA are the only
// text on the Hero now, so we keep the button label inline (not in
// translations.js) — they belong to this section, not the whole site.
const CTA_LABEL = {
  en: 'Reserve an Experience',
  es: 'Reservar una Experiencia',
}

// Fallback headline used when the editable content has no title set (e.g. the
// saved Blob has empty title fields) — the hero should never render headless.
const HEADLINE_FALLBACK = {
  en: { line1: 'Refined Mediterranean', line2: 'Culinary Experience' },
  es: { line1: 'Experiencia Culinaria', line2: 'Mediterránea Refinada' },
}

export default function Hero() {
  const { lang } = useLanguage()
  const { content } = useContent()
  const hero = content.hero
  const pick = (field) => field?.[lang] ?? field?.en ?? ''
  const cta = CTA_LABEL[lang === 'es' ? 'es' : 'en']
  const fb = HEADLINE_FALLBACK[lang === 'es' ? 'es' : 'en']
  const titleLine1 = pick(hero.titleLine1) || fb.line1
  const titleLine2 = pick(hero.titleLine2) || fb.line2

  const trackRef = useRef(null) // tall 250svh scroll runway (mobile only)
  const stageRef = useRef(null) // sticky top:0 viewport-height stage
  const videoRef = useRef(null) // the background video that pans

  // Mobile-only cinematic pan. The DOM is identical at every breakpoint —
  // the desktop/mobile layout switch is done in CSS (.hero-pan-*), so the
  // <video> is never remounted and never restarts. This effect only attaches
  // listeners on phones with motion allowed, and pans the video horizontally
  // via translate3d (compositor-only → playback is never interrupted).
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return
    const track = trackRef.current
    const stage = stageRef.current
    const video = videoRef.current
    if (!track || !stage || !video) return

    const mqMobile = window.matchMedia('(max-width: 767px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let raf = 0
    let overflow = 0 // px the video extends past the right viewport edge
    let vh = 0
    let trackH = 0
    let lastX = NaN
    let active = false

    // Cached geometry — recomputed only on resize / orientation / metadata,
    // never per scroll frame (no layout thrash). overflow is derived from the
    // video's intrinsic ratio so the pan engages even before first paint of
    // the decoded frame.
    const measure = () => {
      vh = window.innerHeight
      trackH = track.offsetHeight
      const vw = video.videoWidth
      const vhgt = video.videoHeight
      const stageW = stage.clientWidth
      const stageH = stage.clientHeight
      const renderedW =
        vw > 0 && vhgt > 0
          ? (stageH * vw) / vhgt
          : video.getBoundingClientRect().width
      overflow = Math.max(0, renderedW - stageW)
      // Landscape / barely-wider video: disable the pan (no dead scroll, fill
      // normally via CSS) so the user isn't trapped in an empty runway.
      track.classList.toggle('is-pan-disabled', overflow < 24)
    }

    const apply = () => {
      raf = 0
      if (overflow < 24) {
        if (lastX !== 0) {
          lastX = 0
          video.style.transform = ''
        }
        return
      }
      const top = track.getBoundingClientRect().top // 0 at pin start, then negative
      const span = trackH - vh // total pinned distance in px
      let p = span > 0 ? -top / span : 0
      p = p < 0 ? 0 : p > 1 ? 1 : p
      const x = Math.round(-(overflow * p)) // integer px avoids a sub-pixel seam
      if (x !== lastX) {
        lastX = x
        video.style.transform = `translate3d(${x}px,0,0)`
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onResize = () => {
      measure()
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onMeta = () => {
      measure()
      apply()
    }

    const teardown = () => {
      if (!active) return
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('loadeddata', onMeta)
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      track.classList.remove('is-pan-disabled')
      video.style.transform = '' // leave the video pristine off-effect
      lastX = NaN
      active = false
    }

    const setup = () => {
      if (active) return
      active = true
      measure()
      apply()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize, { passive: true })
      window.addEventListener('orientationchange', onResize, { passive: true })
      video.addEventListener('loadedmetadata', onMeta)
      video.addEventListener('loadeddata', onMeta)
    }

    // Run the pan only on phones with motion allowed; re-evaluate live when the
    // breakpoint or the reduced-motion preference changes (FIX-4).
    const evaluate = () => {
      if (mqMobile.matches && !mqMotion.matches) setup()
      else teardown()
    }

    evaluate()
    mqMobile.addEventListener('change', evaluate)
    mqMotion.addEventListener('change', evaluate)

    return () => {
      mqMobile.removeEventListener('change', evaluate)
      mqMotion.removeEventListener('change', evaluate)
      teardown()
    }
  }, [])

  return (
    <section id="home" ref={trackRef} className="hero-pan-track">
      <div ref={stageRef} className="hero-pan-stage">
        {/* Single, stable <video> (never remounts). object-left start anchors
            the chef; on mobile it pans left → right with scroll. */}
        <video
          ref={videoRef}
          className="hero-pan-video"
          src={hero.videoUrl}
          poster={hero.posterUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Warm editorial veil — deep-green / charcoal so the cream type stays
            readable and the brand colour carries into the imagery. */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/40 to-ink/85" />
        <div className="absolute inset-0 bg-green-deep/20" />

        <div className="relative mx-auto w-full max-w-3xl px-5 text-center reveal lg:px-8">
          {/* Editorial label, flanked by thin champagne hairlines */}
          <div className="flex items-center justify-center gap-4">
            <span className="hidden h-px w-10 bg-champagne/50 sm:block" aria-hidden="true" />
            <p className="text-[0.7rem] uppercase tracking-[0.42em] text-champagne sm:text-xs">
              Private Chef · New Jersey
            </p>
            <span className="hidden h-px w-10 bg-champagne/50 sm:block" aria-hidden="true" />
          </div>

          {/* Editorial italic headline (the page's single visible h1) */}
          <h1 className="mt-7 font-serif text-4xl italic leading-[1.1] text-cream sm:text-5xl lg:text-[3.75rem]">
            {titleLine1}{' '}
            <span className="text-champagne">{titleLine2}</span>
          </h1>

          {/* Cuisine tagline */}
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed tracking-wide text-cream/75">
            {pick(hero.eyebrow)}
          </p>

          <a href="#contact" className="btn-hero mt-10">
            {cta}
          </a>
        </div>
      </div>
    </section>
  )
}
