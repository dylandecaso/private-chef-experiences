import BilingualField from './BilingualField'
import ImageField from './ImageField'

export default function HeroEditor({ value, onChange }) {
  const set = (key) => (v) => onChange({ ...value, [key]: v })

  // The chip only renders for a given language when its audio file is set.
  // Surface that to the editor so they're not surprised if only one shows up.
  const audioEn = value.audioEn || ''
  const audioEs = value.audioEs || ''
  const asymmetric = (audioEn && !audioEs) || (!audioEn && audioEs)
  const missingLang = audioEn && !audioEs ? 'Spanish' : 'English'

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-cream">Hero</h2>
      <BilingualField label="Eyebrow" value={value.eyebrow} onChange={set('eyebrow')} />
      <BilingualField label="Paragraph 1" value={value.p1} onChange={set('p1')} multiline rows={3} />
      <BilingualField label="Paragraph 2" value={value.p2} onChange={set('p2')} multiline rows={3} />
      <BilingualField label="Paragraph 3" value={value.p3} onChange={set('p3')} multiline rows={3} />

      <div className="grid gap-6 sm:grid-cols-2">
        <ImageField
          label="Background video"
          value={value.videoUrl}
          onChange={set('videoUrl')}
          accept="video/mp4,video/webm"
          hint="MP4/WebM, up to 50 MB"
        />
        <ImageField
          label="Poster image (video fallback)"
          value={value.posterUrl}
          onChange={set('posterUrl')}
        />
      </div>

      <div className="space-y-3 rounded-md border border-line bg-ink-3 p-4">
        <div>
          <h3 className="text-sm uppercase tracking-[0.2em] text-gold">
            Bio narration audio
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Upload the chef reading the bio. Visitors see a speaker icon next
            to the eyebrow only when their language has audio — upload both
            to cover EN and ES visitors. MP3 recommended (~3 MB for 3 min).
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageField
            label="Bio narration (English)"
            value={audioEn}
            onChange={set('audioEn')}
            accept="audio/*"
            hint="MP3 recommended, under 5 MB"
          />
          <ImageField
            label="Bio narration (Español)"
            value={audioEs}
            onChange={set('audioEs')}
            accept="audio/*"
            hint="MP3 recomendado, menos de 5 MB"
          />
        </div>
        {asymmetric && (
          <p className="text-xs text-amber-300/90">
            Heads up: only one language has audio. {missingLang} visitors will
            not see the speaker icon.
          </p>
        )}
      </div>
    </div>
  )
}
