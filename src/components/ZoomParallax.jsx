import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Scroll-driven zoom showcase (inspired by 21st.dev "Zoom Parallax"), adapted
// to this codebase: plain JSX (no TS / shadcn), brand-styled, and given a
// reduced-motion fallback so it respects prefers-reduced-motion like the rest
// of the site. Renders up to 7 images that scale up as the visitor scrolls
// through a tall (300vh) section with a pinned viewport.
export default function ZoomParallax({ images }) {
  const container = useRef(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  const pics = (images || []).slice(0, 7)
  if (pics.length === 0) return null

  // Reduced motion: the showcase is a pure motion effect, so skip it entirely
  // and let the normal gallery grid below stand on its own (the same photos
  // already appear there — no redundant static copy, no large animation).
  if (prefersReduced) return null

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {pics.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length]
          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
            >
              <div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-lg">
                <img
                  src={src}
                  alt={alt || `Gallery image ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
