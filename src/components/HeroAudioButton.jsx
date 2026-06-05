import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// Small speaker chip placed next to the Hero eyebrow. Plays the bio narration
// for the currently active language. Hidden entirely when there is no audio
// for the active language (the editor warning in the admin covers the
// asymmetric-upload UX).
//
// Implementation notes baked into the design (all from the adversarial review):
// - `key={lang}` on the <audio> forces a clean remount on language flip — no
//   InvalidStateError from seeking a freshly-changed src, no overlapping
//   playback, no leaked buffer.
// - Toggle reads `a.paused` instead of React state, so rapid clicks are
//   idempotent and resilient to system-driven pauses (phone calls, etc.).
// - A cleanup effect detaches the src on unmount so audio can never keep
//   playing after the user navigates away.
// - aria-label is computed from { lang, isPlaying } so the announced action
//   always matches what the next click will do.
// - The "playing" pulse is gated on `motion-safe:` to respect the user's OS
//   reduced-motion setting; a solid gold ring fills in for the static case.
export default function HeroAudioButton({ audioEn, audioEs }) {
  const { lang } = useLanguage()
  const audioUrl = lang === 'es' ? audioEs : audioEn
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Pause + detach when the chip unmounts, so audio never plays into a
  // section the visitor no longer sees.
  useEffect(() => {
    const a = audioRef.current
    return () => {
      if (!a) return
      try {
        a.pause()
        a.removeAttribute('src')
        a.load()
      } catch {
        // best-effort cleanup; ignore browser-specific quirks
      }
    }
  }, [])

  if (!audioUrl) return null

  const toggle = async () => {
    const a = audioRef.current
    if (!a) return
    // Drive playback off the element's real state, not React state. The
    // browser may auto-pause (system mixer, tab background, phone call)
    // without us setting isPlaying yet.
    if (a.paused) {
      try {
        await a.play()
      } catch {
        setIsPlaying(false)
      }
    } else {
      a.pause()
    }
  }

  const labels = {
    en: { play: 'Listen to bio', pause: 'Pause bio narration' },
    es: { play: 'Escuchar biografía', pause: 'Pausar biografía' },
  }
  const label = labels[lang === 'es' ? 'es' : 'en'][isPlaying ? 'pause' : 'play']

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/70 bg-ink/70 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
          isPlaying ? 'motion-safe:animate-pulse motion-reduce:bg-gold/30 motion-reduce:text-ink' : ''
        }`}
      >
        {isPlaying ? (
          // Two-bar pause glyph, so the state is obvious even with reduced
          // motion (no pulse to rely on).
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.125em"
            height="1.125em"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
          </svg>
        ) : (
          // Speaker + sound-wave glyph (provided by the user). Universally
          // reads as "audio output" — no AI/chatbot connotation.
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.125em"
            height="1.125em"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <g fill="none" stroke="currentColor">
              <path
                fill="currentColor"
                fillOpacity="0.25"
                d="M3.158 13.93a3.75 3.75 0 0 1 0-3.86a1.5 1.5 0 0 1 .993-.7l1.693-.339a.45.45 0 0 0 .258-.153L8.17 6.395c1.182-1.42 1.774-2.129 2.301-1.938S11 5.572 11 7.42v9.162c0 1.847 0 2.77-.528 2.962c-.527.19-1.119-.519-2.301-1.938L6.1 15.122a.45.45 0 0 0-.257-.153L4.15 14.63a1.5 1.5 0 0 1-.993-.7Z"
              />
              <path
                strokeLinecap="round"
                strokeWidth="1.2"
                d="M15.536 8.464a5 5 0 0 1 .027 7.044m4.094-9.165a8 8 0 0 1 .044 11.27"
              />
            </g>
          </svg>
        )}
      </button>
      {/* `key={lang}` forces a fresh element when the active language flips,
          so there's no stale playback, no race on currentTime, and no
          orphan media element from the previous language. */}
      <audio
        key={lang}
        ref={audioRef}
        src={audioUrl}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
    </>
  )
}
