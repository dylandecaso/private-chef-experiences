// Single source of truth for contact details — edit here once.
export const contact = {
  email: 'hello@privatechef.com',
  phoneDisplay: '+1 (347) 219-5650', // shown to visitors
  phoneTel: '+13472195650', // used in tel: links (digits only, with country code)
  phoneWhatsApp: '13472195650', // used in WhatsApp links (no +, no spaces)
  instagram: '@privatechef_experiences',
  instagramUrl: 'https://instagram.com/privatechef_experiences',
}

// Prefilled WhatsApp message (edit the text freely).
export const whatsappMessage =
  "Hi Chef! I'd like to book a private chef experience. Could we talk?"

// Ready-to-use WhatsApp deep link (opens the app with the message prefilled).
export const whatsappUrl = `https://wa.me/${contact.phoneWhatsApp}?text=${encodeURIComponent(
  whatsappMessage,
)}`
