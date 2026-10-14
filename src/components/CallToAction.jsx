import site from "../data/site"

function CallToAction() {
  return (
    <section className="cta">
      <div>
        <h2>Let's Make Your Next Event <span>Special</span></h2>
        <p>Get in touch with us for more details or to schedule a visit.</p>
      </div>
      <a href={site.whatsappLink} target="_blank" rel="noreferrer" className="cta-button">
        WhatsApp Us
      </a>
    </section>
  )
}

export default CallToAction