// Builds the WhatsApp deep link from the editable contact object so we
// don't have to scatter the encoding logic across components.
export function buildWhatsAppUrl(contact) {
  if (!contact?.phoneWhatsApp) return '#'
  const msg = encodeURIComponent(contact.whatsappMessage || '')
  return `https://wa.me/${contact.phoneWhatsApp}?text=${msg}`
}
