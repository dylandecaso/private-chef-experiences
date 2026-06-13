import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentContext'

const SERVICE_KEYS = [
  'privateDinner',
  'weeklyMealPrep',
  'eventsCelebrations',
  'healthyCustomized',
  'inHomeChef',
  'other',
]

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  service: '',
}

// Inputs use 16px on mobile (text-base) so iOS Safari doesn't auto-zoom on
// focus, dropping to 14px (sm:text-sm) on larger screens. Extra top padding
// (pt-5) reserves room for the floating label to sit inside the field.
const fieldClass =
  'peer w-full rounded-md border border-hairline-light bg-green-deep/40 px-3 pb-2 pt-5 text-base text-cream outline-none transition-colors focus:border-champagne focus:ring-1 focus:ring-champagne/30 sm:text-sm'

// Floating label: behaves like a placeholder when the field is empty and
// unfocused, then floats up to a small champagne caption on focus or once filled.
// Driven purely by CSS via the input's `peer` + `placeholder=" "`.
const labelClass =
  'pointer-events-none absolute left-3 top-1.5 text-xs text-champagne transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-cream/50 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-champagne'

function FloatingField({ id, name, label, type = 'text', required = false, value, onChange }) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={fieldClass}
      />
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
    </div>
  )
}

export default function ContactForm() {
  const { t, lang } = useLanguage()
  const { content } = useContent()
  const pick = (field) => field?.[lang] ?? field?.en ?? ''
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('success')
      setForm(initialState)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <h3 className="text-sm uppercase tracking-[0.3em] text-champagne">
        {pick(content.contactForm.title) || t('contactForm.title')}
      </h3>
      <p className="mt-3 text-xs leading-relaxed text-cream/70">
        {pick(content.contactForm.subtitle) || t('contactForm.subtitle')}
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3" noValidate>
        <div className="grid grid-cols-2 gap-2">
          <FloatingField
            id="firstName"
            name="firstName"
            label={t('contactForm.firstName')}
            required
            value={form.firstName}
            onChange={onChange}
          />
          <FloatingField
            id="lastName"
            name="lastName"
            label={t('contactForm.lastName')}
            required
            value={form.lastName}
            onChange={onChange}
          />
        </div>

        <FloatingField
          id="email"
          name="email"
          type="email"
          label={t('contactForm.email')}
          required
          value={form.email}
          onChange={onChange}
        />

        <FloatingField
          id="phone"
          name="phone"
          type="tel"
          label={t('contactForm.phone')}
          value={form.phone}
          onChange={onChange}
        />

        {/* Select keeps a persistent floating label (native selects have no
            placeholder-shown state to drive the float). */}
        <div className="relative">
          <select
            id="service"
            name="service"
            required
            value={form.service}
            onChange={onChange}
            className={`${fieldClass} ${form.service ? 'text-cream' : 'text-cream/50'}`}
          >
            <option value="" disabled>
              {t('contactForm.servicePlaceholder')}
            </option>
            {SERVICE_KEYS.map((key) => (
              <option key={key} value={key} className="text-cream">
                {t(`contactForm.services.${key}`)}
              </option>
            ))}
          </select>
          <label
            htmlFor="service"
            className="pointer-events-none absolute left-3 top-1.5 text-xs text-champagne"
          >
            {t('contactForm.service')} <span aria-hidden="true">*</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-full bg-champagne px-6 py-2.5 text-sm font-medium tracking-wide text-green-deep transition-all hover:bg-cream disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'sending' ? t('contactForm.sending') : t('contactForm.submit')}
        </button>

        {status === 'success' && (
          <p role="status" className="text-xs leading-relaxed text-champagne">
            {t('contactForm.success')}
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="text-xs leading-relaxed text-red-300">
            {t('contactForm.error')}
          </p>
        )}
      </form>
    </div>
  )
}
