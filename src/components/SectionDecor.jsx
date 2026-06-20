import { useEffect, useRef } from 'react'

// Decorative floating ingredients for a section. Renders absolutely-positioned,
// low-opacity PNGs that drift (parallax) and gently rotate as the section moves
// through the viewport — a subtle culinary "depth" accent.
//
// Purely decorative: the layer is pointer-events-none + aria-hidden, the effect
// freezes for prefers-reduced-motion, and individual items can be hidden on
// phones via their className (e.g. "hidden sm:block"). Each item is:
//   { src, className, rot, opacity, speed, spin }
// where className places + sizes it with Tailwind (position + width), rot is the
// base rotation in degrees, speed scales the scroll drift and spin the rotation.
export default function SectionDecor({ items }) {
  const ref = useRef(null)

  useEffect(() => {
    const layer = ref.current
    if (!layer) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const els = Array.from(layer.querySelectorAll('[data-speed]'))
    if (els.length === 0) return

    let raf = 0
    const apply = () => {
      raf = 0
      const vh = window.innerHeight || 1
      const rect = layer.getBoundingClientRect()
      // p ≈ -0.5 (section entering from the bottom) → 0 (centered) → 0.5 (leaving the top)
      const center = rect.top + rect.height / 2
      const p = (vh / 2 - center) / vh
      for (const el of els) {
        const speed = parseFloat(el.dataset.speed) || 0
        const spin = parseFloat(el.dataset.spin) || 0
        const rot = parseFloat(el.dataset.rot) || 0
        el.style.transform = `translate3d(0, ${(p * speed * 100).toFixed(1)}px, 0) rotate(${(
          rot +
          p * spin
        ).toFixed(1)}deg)`
      }
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {items.map((it, i) => (
        <img
          key={i}
          src={it.src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          data-speed={it.speed ?? 1}
          data-spin={it.spin ?? 0}
          data-rot={it.rot ?? 0}
          style={{ opacity: it.opacity ?? 0.3, transform: `rotate(${it.rot ?? 0}deg)` }}
          className={`absolute select-none will-change-transform ${it.className}`}
        />
      ))}
    </div>
  )
}
