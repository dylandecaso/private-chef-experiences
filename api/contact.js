// Vercel serverless function for contact-form submissions. Via Resend it does
// two things: (1) emails the chef an internal notification, and (2) sends the
// visitor an automatic confirmation. Configure in the Vercel dashboard:
//   RESEND_API_KEY     — your Resend API key
//   CONTACT_TO_EMAIL   — where the chef receives notifications (comma-separated ok)
//   CONTACT_FROM_EMAIL — the "from" used for BOTH emails. Leave it unset until a
//                        domain is verified in Resend (we fall back to the shared
//                        onboarding@resend.dev sender). Once verified, set it to a
//                        sender on that domain, e.g.
//                        "Private Chef Experiences <hello@privatechef-experiences.com>".
//                        That single change also delivers the visitor confirmation
//                        to everyone (see the note near the confirmation send below).
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
    // Used as the "from" for BOTH the internal notification and the visitor
    // confirmation. The onboarding@resend.dev fallback works without domain
    // verification (a display name is allowed). Set CONTACT_FROM_EMAIL once the
    // domain is verified — no code change required.
    const from =
      process.env.CONTACT_FROM_EMAIL || 'Private Chef Experiences <onboarding@resend.dev>'

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

    // Send the visitor an automatic confirmation email (best-effort). This must
    // never affect the internal notification above or the 200 response below.
    //
    // LIMITATION: with the shared onboarding@resend.dev sender, Resend only
    // delivers to the account owner's own address — confirmations to any other
    // visitor are rejected (logged here, then ignored). Once a domain is verified
    // in Resend and CONTACT_FROM_EMAIL points to a sender on it, this starts
    // reaching every visitor with no further code changes.
    try {
      const niceName = escapeHtml(firstName.trim())
      const confirmationHtml = `
        <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; background: #ffffff; color: #1a1a1a; padding: 8px 0;">
          <p style="text-align: center; margin: 0; padding: 8px 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #b08d57; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">Private Chef Experiences</p>
          <div style="height: 1px; background: #e7e0d5; margin: 12px auto; width: 80%;"></div>
          <div style="padding: 8px 24px 0;">
            <h1 style="margin: 0 0 18px; font-size: 24px; font-weight: normal;">Thank you for reaching out</h1>
            <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #3a3a3a;">Dear ${niceName},</p>
            <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #3a3a3a;">Thank you for contacting Private Chef Experiences. We've received your message and will be in touch with you as soon as possible to begin crafting a dining experience tailored to you.</p>
            <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.7; color: #3a3a3a;">We look forward to welcoming you to the table.</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.6;">Warm regards,</p>
            <p style="margin: 2px 0 0; font-size: 15px; font-style: italic; color: #b08d57;">Emanuel Aciar — Private Chef</p>
          </div>
          <div style="height: 1px; background: #e7e0d5; margin: 24px auto 12px; width: 80%;"></div>
          <p style="text-align: center; margin: 0; font-size: 12px; color: #9a9a9a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">New Jersey, USA &middot; privatechef-experiences.com</p>
        </div>
      `.trim()
      const confirmationText = [
        `Dear ${firstName.trim()},`,
        '',
        "Thank you for contacting Private Chef Experiences. We've received your message and will be in touch with you as soon as possible to begin crafting a dining experience tailored to you.",
        '',
        'We look forward to welcoming you to the table.',
        '',
        'Warm regards,',
        'Emanuel Aciar — Private Chef',
        'New Jersey, USA · privatechef-experiences.com',
      ].join('\n')

      const { error: confirmError } = await resend.emails.send({
        from,
        to: email.trim(),
        subject: 'Thank you for reaching out — Private Chef Experiences',
        replyTo: to[0],
        html: confirmationHtml,
        text: confirmationText,
      })
      if (confirmError) {
        console.error('Confirmation email skipped:', confirmError)
      }
    } catch (confirmErr) {
      console.error('Confirmation email error:', confirmErr)
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Contact handler error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
