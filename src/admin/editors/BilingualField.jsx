// Two side-by-side text inputs for the EN and ES versions of a localized
// field. `value` is { en, es }, onChange receives the next { en, es }.
export default function BilingualField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}) {
  const v = value || { en: '', es: '' }
  const baseInput =
    'w-full rounded-md border border-line bg-ink-3 px-3 py-2 text-sm text-cream placeholder-muted/50 outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/40'

  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <div className="grid gap-3 sm:grid-cols-2">
        {['en', 'es'].map((lang) => {
          const props = {
            value: v[lang] || '',
            onChange: (e) => onChange({ ...v, [lang]: e.target.value }),
            placeholder: lang.toUpperCase(),
            className: baseInput,
          }
          return multiline ? (
            <textarea key={lang} rows={rows} {...props} />
          ) : (
            <input key={lang} type="text" {...props} />
          )
        })}
      </div>
    </label>
  )
}
