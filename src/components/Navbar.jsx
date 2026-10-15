import { Link, NavLink } from "react-router-dom"
import site from "../data/site"
import WhatsAppIcon from "./WhatsAppIcon"

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-mark">S</span>
        <span className="logo-text">
          <strong>SIGNATURE HALL</strong>
          <small>KANNUR</small>
        </span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/spaces">Our Spaces</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>

      <a href={site.whatsappLink} target="_blank" rel="noreferrer" className="nav-whatsapp">
        <WhatsAppIcon size={20} />
        WhatsApp Us
      </a>
    </nav>
  )
}

export default Navbar