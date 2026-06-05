import BilingualField from './BilingualField'

const ICONS = ['dinner', 'prep', 'events', 'healthy', 'home']

function makeItem() {
  return {
    id: `service-${Math.random().toString(36).slice(2, 8)}`,
    icon: 'dinner',
    title: { en: '', es: '' },
    text: { en: '', es: '' },
  }
}

export default function ServicesEditor({ value, onChange }) {
  const setTitle = (v) => onChange({ ...value, title: v })
  const setItems = (items) => onChange({ ...value, items })

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-cream">Services</h2>
      <BilingualField label="Section title" value={value.title} onChange={setTitle} />

      <div className="space-y-4">
        {value.items.map((item, i) => (
          <div key={item.id} className="rounded-md border border-line bg-ink-3 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="text-xs uppercase tracking-[0.2em] text-muted">
                Icon
                <select
                  value={item.icon}
                  onChange={(e) => {
                    const next = [...value.items]
                    next[i] = { ...item, icon: e.target.value }
                    setItems(next)
                  }}
                  className="ml-3 rounded-md border border-line bg-ink-2 px-2 py-1 text-xs text-cream"
                >
                  {ICONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => setItems(value.items.filter((_, j) => j !== i))}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
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
        ))}
      </div>

      <button
        type="button"
        onClick={() => setItems([...value.items, makeItem()])}
        className="rounded-full border border-gold px-4 py-2 text-xs tracking-wide text-gold transition-all hover:bg-gold hover:text-ink"
      >
        + Add service
      </button>
    </div>
  )
}
