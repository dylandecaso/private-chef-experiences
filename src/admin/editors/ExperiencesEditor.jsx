import BilingualField from './BilingualField'
import ImageField from './ImageField'

function makeItem() {
  return {
    id: `exp-${Math.random().toString(36).slice(2, 8)}`,
    imageUrl: '',
    title: { en: '', es: '' },
    text: { en: '', es: '' },
  }
}

export default function ExperiencesEditor({ value, onChange }) {
  const setTitle = (v) => onChange({ ...value, title: v })
  const setItems = (items) => onChange({ ...value, items })

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-cream">Experiences</h2>
      <BilingualField label="Section title" value={value.title} onChange={setTitle} />

      <div className="space-y-4">
        {value.items.map((item, i) => (
          <div key={item.id} className="rounded-md border border-line bg-ink-3 p-4">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setItems(value.items.filter((_, j) => j !== i))}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
              <ImageField
                label="Image"
                value={item.imageUrl}
                onChange={(url) => {
                  const next = [...value.items]
                  next[i] = { ...item, imageUrl: url }
                  setItems(next)
                }}
              />
              <div className="space-y-3">
                <BilingualField
                  label="Title"
                  value={item.title}
                  onChange={(v) => {
                    const next = [...value.items]
                    next[i] = { ...item, title: v }
                    setItems(next)
                  }}
                />
                <BilingualField
                  label="Description"
                  value={item.text}
                  onChange={(v) => {
                    const next = [...value.items]
                    next[i] = { ...item, text: v }
                    setItems(next)
                  }}
                  multiline
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setItems([...value.items, makeItem()])}
        className="rounded-full border border-gold px-4 py-2 text-xs tracking-wide text-gold transition-all hover:bg-gold hover:text-ink"
      >
        + Add experience
      </button>
    </div>
  )
}
