import { MapPin, Phone, MessageCircle } from "lucide-react"
import site from "../data/site"
import { Link } from "react-router-dom"
import InstagramIcon from "./InstagramIcon"

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
            <Link to="/">Home</Link>
            <Link to="/spaces">Our Spaces</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
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
          {site.instagram && (
          <a href={site.instagram} target="_blank" rel="noreferrer" className="footer-row">
            <InstagramIcon size={18} /> Instagram
          </a>
        )}
        </div>
      </div>

      <p className="copyright">© {year} Signature Hall, Kannur</p>
    </footer>
  )
}

export default Footer