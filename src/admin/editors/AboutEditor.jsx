import BilingualField from './BilingualField'
import ImageField from './ImageField'

export default function AboutEditor({ value, onChange }) {
  const set = (key) => (v) => onChange({ ...value, [key]: v })
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-cream">About</h2>
      <BilingualField label="Eyebrow" value={value.eyebrow} onChange={set('eyebrow')} />
      <BilingualField label="Title (line 1)" value={value.titleLine1} onChange={set('titleLine1')} />
      <BilingualField label="Title (line 2)" value={value.titleLine2} onChange={set('titleLine2')} />
      <BilingualField label="Title (line 3, gold)" value={value.titleLine3} onChange={set('titleLine3')} />
      <BilingualField label="Paragraph 1" value={value.p1} onChange={set('p1')} multiline rows={3} />
      <BilingualField label="Paragraph 2" value={value.p2} onChange={set('p2')} multiline rows={3} />
      <BilingualField label="CTA button" value={value.cta} onChange={set('cta')} />
      <ImageField label="Portrait" value={value.imageUrl} onChange={set('imageUrl')} />
    </div>
  )
}
