// Vercel serverless function that delivers contact-form submissions to
// the chef's inbox via Resend. Configure these in the Vercel dashboard:
//   RESEND_API_KEY     — your Resend API key
//   CONTACT_TO_EMAIL   — destination address (defaults to the one below)
//   CONTACT_FROM_EMAIL — verified sender on Resend (e.g. "Site <noreply@yourdomain.com>")
import { Resend } from 'resend'
import { addLead } from './_lib/blobStore.js'

const SERVICE_LABELS = {
  privateDinner: { en: 'Private Dinner', es: 'Cena Privada' },
  weeklyMealPrep: { en: 'Weekly Meal Prep', es: 'Viandas Semanales' },
  eventsCelebrations: {
    en: 'Events & Celebrations',
    es: 'Eventos y Celebraciones',
  },
  healthyCustomized: {
    en: 'Healthy & Customized',
    es: 'Saludable y Personalizado',
  },
  inHomeChef: { en: 'In-Home Chef Service', es: 'Chef a Domicilio' },
  other: { en: 'Other', es: 'Otro' },
}

const escapeHtml = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const {
      firstName = '',
      lastName = '',
      email = '',
      phone = '',
      service = '',
      lang = 'en',
    } = body || {}

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !service.trim()) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email' })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'Email service not configured' })
    }

    // Supports a single email or a comma-separated list ("a@x.com,b@x.com").
    const to = (process.env.CONTACT_TO_EMAIL || 'dylandecaso1520@gmail.com')
      .split(',')
      .map((addr) => addr.trim())
      .filter(Boolean)
    // Resend's default test sender works without domain verification.
    const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'

    const serviceLabel =
      SERVICE_LABELS[service]?.[lang] ||
      SERVICE_LABELS[service]?.en ||
      service

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
    const subject = `New booking request — ${fullName}`

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="margin: 0 0 16px;">New contact request</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #666;">Name</td><td style="padding: 6px 0;">${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Phone</td><td style="padding: 6px 0;">${escapeHtml(phone) || '—'}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Service</td><td style="padding: 6px 0;">${escapeHtml(serviceLabel)}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Language</td><td style="padding: 6px 0;">${escapeHtml(lang)}</td></tr>
        </table>
      </div>
    `.trim()

    const text = [
      'New contact request',
      '',
      `Name:    ${fullName}`,
      `Email:   ${email}`,
      `Phone:   ${phone || '—'}`,
      `Service: ${serviceLabel}`,
      `Lang:    ${lang}`,
    ].join('\n')

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      replyTo: email.trim(),
      html,
      text,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(502).json({ error: 'Email delivery failed' })
    }

    // Persist the lead (best-effort) so it appears in /admin → Clientes
    // potenciales. A storage failure must not fail the email that already sent.
    try {
      await addLead({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service,
        source: 'form',
      })
    } catch (storeErr) {
      console.error('lead store error:', storeErr)
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact handler error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
