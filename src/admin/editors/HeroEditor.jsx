import BilingualField from './BilingualField'
import ImageField from './ImageField'

export default function HeroEditor({ value, onChange }) {
  const set = (key) => (v) => onChange({ ...value, [key]: v })
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
    </div>
  )
}
