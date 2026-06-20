import { useEffect, useRef } from 'react'

// Decorative floating ingredients for a section. Each item is a positioned
// <span> (carries the scroll-parallax + a subtle mouse drift, set in JS)
// wrapping an <img> that runs a slow CSS float/scale/rotate loop — the two
// transforms live on different elements so they compose instead of fighting.
//
// Front layer (z-20) so the ingredients read as floating *over* the section,
// but pointer-events-none + aria-hidden keep them clear of clicks and a11y.
// The effect freezes for prefers-reduced-motion; the mouse drift is desktop
// only (pointer: fine); items can be hidden per-breakpoint via className.
// Each item: { src, className, rot, opacity, speed, spin, dur, delay }
export default function SectionDecor({ items }) {
  const ref = useRef(null)

  useEffect(() => {
    const layer = ref.current
    if (!layer) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const els = Array.from(layer.querySelectorAll('[data-speed]'))
    if (els.length === 0) return

    const fine = window.matchMedia?.('(pointer: fine)').matches
    let scrollP = 0 // -0.5 (entering) → 0 (centered) → 0.5 (leaving)
    let mx = 0 // normalized cursor X (-1..1)
    let my = 0 // normalized cursor Y (-1..1)
    let raf = 0

    const apply = () => {
      raf = 0
      for (const el of els) {
        const speed = parseFloat(el.dataset.speed) || 0
        const spin = parseFloat(el.dataset.spin) || 0
        const rot = parseFloat(el.dataset.rot) || 0
        const x = mx * speed * 12
        const y = scrollP * speed * 90 + my * speed * 10
        const r = rot + scrollP * spin + mx * speed * 1.5
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${r.toFixed(1)}deg)`
      }
    }
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(apply)
    }

    const onScroll = () => {
      const vh = window.innerHeight || 1
      const rect = layer.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      scrollP = (vh / 2 - center) / vh
      schedule()
    }
    const onMouse = (e) => {
      mx = (e.clientX / (window.innerWidth || 1)) * 2 - 1
      my = (e.clientY / (window.innerHeight || 1)) * 2 - 1
      schedule()
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    if (fine) window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (fine) window.removeEventListener('mousemove', onMouse)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {items.map((it, i) => (
        <span
          key={i}
          data-speed={it.speed ?? 1}
          data-spin={it.spin ?? 0}
          data-rot={it.rot ?? 0}
          style={{ transform: `rotate(${it.rot ?? 0}deg)` }}
          className={`absolute block will-change-transform ${it.className}`}
        >
          <img
            src={it.src}
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
            className="decor-anim h-auto w-full select-none drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]"
            style={{
              opacity: it.opacity ?? 0.9,
              animationDuration: it.dur ?? '7s',
              animationDelay: it.delay ?? '0s',
            }}
          />
        </span>
      ))}
    </div>
  )
}
