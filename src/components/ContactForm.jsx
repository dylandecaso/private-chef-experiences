import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

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

export default function ContactForm() {
  const { t, lang } = useLanguage()
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

  const inputClass =
    'w-full rounded-md border border-line bg-ink-3 px-3 py-2 text-sm text-cream placeholder-muted/60 outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/40'

  return (
    <div>
      <h3 className="text-sm uppercase tracking-[0.3em] text-gold">
        {t('contactForm.title')}
      </h3>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        {t('contactForm.subtitle')}
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3" noValidate>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="firstName"
            required
            value={form.firstName}
            onChange={onChange}
            placeholder={t('contactForm.firstName')}
            aria-label={t('contactForm.firstName')}
            className={inputClass}
          />
          <input
            type="text"
            name="lastName"
            required
            value={form.lastName}
            onChange={onChange}
            placeholder={t('contactForm.lastName')}
            aria-label={t('contactForm.lastName')}
            className={inputClass}
          />
        </div>

        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={onChange}
          placeholder={t('contactForm.email')}
          aria-label={t('contactForm.email')}
          className={inputClass}
        />

        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder={t('contactForm.phone')}
          aria-label={t('contactForm.phone')}
          className={inputClass}
        />

        <select
          name="service"
          required
          value={form.service}
          onChange={onChange}
          aria-label={t('contactForm.service')}
          className={`${inputClass} ${form.service ? '' : 'text-muted/60'}`}
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

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-full bg-gold px-6 py-2.5 text-sm font-medium tracking-wide text-ink transition-all hover:bg-cream disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'sending' ? t('contactForm.sending') : t('contactForm.submit')}
        </button>

        {status === 'success' && (
          <p
            role="status"
            className="text-xs leading-relaxed text-gold"
          >
            {t('contactForm.success')}
          </p>
        )}
        {status === 'error' && (
          <p
            role="alert"
            className="text-xs leading-relaxed text-red-400"
          >
            {t('contactForm.error')}
          </p>
        )}
      </form>
    </div>
  )
}
