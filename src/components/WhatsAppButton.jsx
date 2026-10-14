import site from "../data/site"

function WhatsAppButton() {
  return (
    <a href={site.whatsappLink} target="_blank" rel="noreferrer" className="whatsapp-button">
      Chat on WhatsApp
    </a>
  )
}

export default WhatsAppButton