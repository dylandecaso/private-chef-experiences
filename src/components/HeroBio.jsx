import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'
import HeroAudioButton from './HeroAudioButton'

// Section pulled out of the Hero so the bio copy doesn't fight the video
// background for legibility. Rendered between Hero and Services.
// Reads hero.p1/p2/p3 — the same fields that used to live inside Hero, so
// admin edits keep working without changes to the schema.
// A background video (hero.bioVideoUrl) sits behind the text with a veil
// overlay; the copy gets a soft text-shadow so it stays readable over it.
export default function HeroBio() {
  const { lang } = useLanguage()
  const { content } = useContent()
  const hero = content.hero
  const pick = (field) => field?.[lang] ?? field?.en ?? ''

  const paragraphs = [pick(hero.p1), pick(hero.p2), pick(hero.p3)].filter(Boolean)
  if (paragraphs.length === 0) return null

  const bioVideo = hero.bioVideoUrl

  return (
    <section className="relative overflow-hidden bg-green-deep py-24 lg:py-32">
      {bioVideo && (
        // object-bottom keeps the flames (which rise from the bottom of the
        // clip) anchored to the bottom edge, so they're never cropped off
        // when the section is shorter than the video.
        <video
          className="absolute inset-0 h-full w-full object-cover object-bottom"
          src={bioVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}

      {/* Veil — visible video, but a medium scrim plus vertical fade keeps
          the copy readable. Drops to a flat tint when there's no video. */}
      {bioVideo ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-green-deep/85 via-green-deep/55 to-green-deep/85" />
          <div className="absolute inset-0 bg-green-deep/25" />
        </>
      ) : null}

      <div className="relative mx-auto max-w-3xl px-5 text-center reveal lg:px-8">
        {/* Bio narration moved here from the Hero — it belongs next to the
            bio copy it reads. Sits above the first paragraph. */}
        <div className="mb-8 flex justify-center">
          <HeroAudioButton audioEn={hero.audioEn} audioEs={hero.audioEs} />
        </div>

        {/* Editorial label, flanked by thin champagne hairlines */}
        <div className="mb-7 flex items-center justify-center gap-4">
          <span className="hidden h-px w-10 bg-champagne/50 sm:block" aria-hidden="true" />
          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-champagne sm:text-xs">
            The Chef
          </p>
          <span className="hidden h-px w-10 bg-champagne/50 sm:block" aria-hidden="true" />
        </div>

        <div
          className="space-y-6 text-base leading-relaxed text-cream/90 [&_strong]:text-champagne [&_em]:text-champagne sm:text-lg"
          style={bioVideo ? { textShadow: '0 1px 12px rgba(0,0,0,0.6)' } : undefined}
        >
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
