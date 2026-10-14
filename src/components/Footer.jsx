import { MapPin, Phone, MessageCircle } from "lucide-react"
import site from "../data/site"

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" id="contact">
      <div className="footer-grid">
        <div>
          <p className="footer-logo">SIGNATURE HALL</p>
          <p className="footer-small">KANNUR</p>
          <p>Your special moments, our special place.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <a href="#top">Home</a>
          <a href="#spaces">Our Spaces</a>
          <a href="#gallery">Gallery</a>
        </div>

        <div>
          <h4>Location</h4>
          <p className="footer-row"><MapPin size={18} /> {site.address}</p>
          <a href={site.mapLink} target="_blank" rel="noreferrer">Open in Google Maps</a>
        </div>

        <div>
          <h4>Get in Touch</h4>
          <a href={site.whatsappLink} target="_blank" rel="noreferrer" className="footer-row">
            <MessageCircle size={18} /> WhatsApp Us
          </a>
          <a href={`tel:${site.phone}`} className="footer-row">
            <Phone size={18} /> {site.phone}
          </a>
        </div>
      </div>

      <p className="copyright">© {year} Signature Hall, Kannur</p>
    </footer>
  )
}

export default Footer