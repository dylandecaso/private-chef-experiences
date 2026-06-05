import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'

// Section pulled out of the Hero so the bio copy doesn't fight the video
// background for legibility. Rendered between Hero and Services.
// Reads hero.p1/p2/p3 — the same fields that used to live inside Hero, so
// admin edits keep working without changes to the schema.
export default function HeroBio() {
  const { lang } = useLanguage()
  const { content } = useContent()
  const hero = content.hero
  const pick = (field) => field?.[lang] ?? field?.en ?? ''

  const paragraphs = [pick(hero.p1), pick(hero.p2), pick(hero.p3)].filter(Boolean)
  if (paragraphs.length === 0) return null

  return (
    <section className="bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center reveal lg:px-8">
        <div className="space-y-6 text-base leading-relaxed text-muted sm:text-lg">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
