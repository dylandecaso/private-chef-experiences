// Single-language fields (phone, email, IG handle) plus the bilingual
// contact-form copy. The phoneWhatsApp field is derived from phoneTel so
// the admin only types one number.
import BilingualField from './BilingualField'

const input =
  'w-full rounded-md border border-line bg-ink-3 px-3 py-2 text-sm text-cream placeholder-muted/50 outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/40'

export default function ContactEditor({ contact, contactForm, onChange }) {
  const setContact = (key, v) =>
    onChange({ contact: { ...contact, [key]: v }, contactForm })
  const setForm = (key, v) =>
    onChange({ contact, contactForm: { ...contactForm, [key]: v } })

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="font-serif text-2xl text-cream">Contact details</h2>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">Email</span>
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => setContact('email', e.target.value)}
            className={input}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
              Phone (display)
            </span>
            <input
              type="text"
              value={contact.phoneDisplay || ''}
              onChange={(e) => setContact('phoneDisplay', e.target.value)}
              placeholder="+1 (347) 219-5650"
              className={input}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
              Phone (digits only)
            </span>
            <input
              type="text"
              value={contact.phoneTel || ''}
              onChange={(e) => {
                const tel = e.target.value
                onChange({
                  contact: {
                    ...contact,
                    phoneTel: tel,
                    phoneWhatsApp: tel.replace(/[^0-9]/g, ''),
                  },
                  contactForm,
                })
              }}
              placeholder="+13472195650"
              className={input}
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
              Instagram handle
            </span>
            <input
              type="text"
              value={contact.instagram || ''}
              onChange={(e) => setContact('instagram', e.target.value)}
              className={input}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
              Instagram URL
            </span>
            <input
              type="url"
              value={contact.instagramUrl || ''}
              onChange={(e) => setContact('instagramUrl', e.target.value)}
              className={input}
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
            WhatsApp prefilled message
          </span>
          <textarea
            rows={2}
            value={contact.whatsappMessage || ''}
            onChange={(e) => setContact('whatsappMessage', e.target.value)}
            className={input}
          />
        </label>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-2xl text-cream">Contact form copy</h2>
        <BilingualField label="Title" value={contactForm.title} onChange={(v) => setForm('title', v)} />
        <BilingualField label="Subtitle" value={contactForm.subtitle} onChange={(v) => setForm('subtitle', v)} multiline rows={2} />
      </div>
    </div>
  )
}
