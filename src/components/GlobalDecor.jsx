import { useEffect, useRef } from 'react'

// Global foreground decor: ingredient PNGs that float OVER the whole layout and
// are never clipped at a section boundary. One absolute, full-DOCUMENT,
// pointer-events-none layer sits above the page content (z-30, below the fixed
// header / WhatsApp at z-50). Because the layer spans the entire document, its
// overflow only ever clips at the document's outer edges — never between
// sections — so each ingredient shows complete.
//
// Each item drifts with scroll (parallax, measured from offsetTop so the applied
// transform never feeds back into the measurement) plus a subtle desktop mouse
// drift, while the <img> runs a slow CSS float/scale loop (.decor-anim). The
// whole effect freezes for prefers-reduced-motion; items flagged mobile:false
// are hidden on phones. Edit ITEMS to tune which ingredient floats where.
const ITEMS = [
  { src: '/images/decor/4.png', side: 'left', top: '15%', size: 'w-20 sm:w-44 lg:w-56', rot: -10, opacity: 0.9, speed: 1.2, spin: 4, dur: '7s', delay: '0s', mobile: true },
  { src: '/images/decor/6.png', side: 'right', top: '30%', size: 'w-24 sm:w-48 lg:w-60', rot: 10, opacity: 0.9, speed: 1.5, spin: -5, dur: '7.5s', delay: '0.4s', mobile: true },
  { src: '/images/decor/1.png', side: 'left', top: '45%', size: 'w-24 sm:w-44 lg:w-56', rot: 8, opacity: 0.85, speed: 1.3, spin: -4, dur: '8.5s', delay: '1.2s', mobile: false },
  { src: '/images/decor/2.png', side: 'right', top: '58%', size: 'w-24 sm:w-44 lg:w-52', rot: -8, opacity: 0.85, speed: 1.7, spin: 5, dur: '9s', delay: '1.6s', mobile: true },
  { src: '/images/decor/5.png', side: 'left', top: '74%', size: 'w-16 sm:w-36 lg:w-44', rot: -8, opacity: 0.9, speed: 1.4, spin: 6, dur: '7s', delay: '0.3s', mobile: false },
  { src: '/images/decor/3.png', side: 'right', top: '86%', size: 'w-20 sm:w-36 lg:w-44', rot: 10, opacity: 0.85, speed: 1.8, spin: -6, dur: '8s', delay: '1.5s', mobile: false },
]

export default function GlobalDecor() {
  const ref = useRef(null)

  useEffect(() => {
    const layer = ref.current
    if (!layer) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const els = Array.from(layer.querySelectorAll('[data-speed]'))
    if (els.length === 0) return

    const fine = window.matchMedia?.('(pointer: fine)').matches
    let mx = 0
    let my = 0
    let cache = []
    let raf = 0

    const measure = () => {
      cache = els.map((el) => ({
        el,
        top: el.offsetTop,
        h: el.offsetHeight,
        speed: parseFloat(el.dataset.speed) || 0,
        spin: parseFloat(el.dataset.spin) || 0,
        rot: parseFloat(el.dataset.rot) || 0,
      }))
    }
    const apply = () => {
      raf = 0
      const vh = window.innerHeight || 1
      const sy = window.scrollY || 0
      for (const it of cache) {
        const center = it.top - sy + it.h / 2
        const p = (vh / 2 - center) / vh // -0.5 (below) → 0 (centered) → 0.5 (above)
        const x = mx * it.speed * 12
        const y = p * it.speed * 60 + my * it.speed * 10
        const r = it.rot + p * it.spin + mx * it.speed * 1.5
        it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${r.toFixed(1)}deg)`
      }
    }
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(apply)
    }
    const onResize = () => {
      measure()
      schedule()
    }
    const onMouse = (e) => {
      mx = (e.clientX / (window.innerWidth || 1)) * 2 - 1
      my = (e.clientY / (window.innerHeight || 1)) * 2 - 1
      schedule()
    }

    measure()
    apply()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('load', onResize)
    if (fine) window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      if (fine) window.removeEventListener('mousemove', onMouse)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      {ITEMS.map((it, i) => (
        <span
          key={i}
          data-speed={it.speed}
          data-spin={it.spin}
          data-rot={it.rot}
          style={{ top: it.top, transform: `rotate(${it.rot}deg)` }}
          className={`absolute block will-change-transform ${
            it.side === 'left' ? 'left-[1%]' : 'right-[1%]'
          } ${it.size} ${it.mobile ? '' : 'hidden sm:block'}`}
        >
          <img
            src={it.src}
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
            className="decor-anim aspect-square w-full select-none drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
            style={{ opacity: it.opacity, animationDuration: it.dur, animationDelay: it.delay }}
          />
        </span>
      ))}
    </div>
  )
}
