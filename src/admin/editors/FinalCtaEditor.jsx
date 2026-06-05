import BilingualField from './BilingualField'

export default function FinalCtaEditor({ value, onChange }) {
  const set = (key) => (v) => onChange({ ...value, [key]: v })
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-cream">Final CTA</h2>
      <BilingualField label="Title (line 1)" value={value.titleLine1} onChange={set('titleLine1')} />
      <BilingualField label="Title (line 2, gold)" value={value.titleLine2} onChange={set('titleLine2')} />
      <BilingualField label="Description" value={value.description} onChange={set('description')} multiline rows={3} />
      <BilingualField label="CTA button" value={value.cta} onChange={set('cta')} />
    </div>
  )
}
