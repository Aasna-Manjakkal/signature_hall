import site from "../data/site"

function WhatsAppButton() {
  const message = "Hello, I would like to enquire about booking Signature Hall."
  const link = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`

  return (
    <a href={link} target="_blank" rel="noreferrer" className="whatsapp-button">
      Chat on WhatsApp
    </a>
  )
}

export default WhatsAppButton