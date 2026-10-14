import site from "../data/site"

function Navbar() {
  

  return (
    <nav className="navbar">
      <a href="#top" className="logo">
        <span className="logo-mark">S</span>
        <span className="logo-text">
          <strong>SIGNATURE HALL</strong>
          <small>KANNUR</small>
        </span>
      </a>

      <div className="nav-links">
        <a href="#top">Home</a>
        <a href="#spaces">Our Spaces</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
      </div>

      <a href={site.whatsappLink} target="_blank" rel="noreferrer" className="nav-whatsapp">
        WhatsApp Us
      </a>
    </nav>
  )
}

export default Navbar