import { Phone, Mail, MapPin } from "lucide-react"
import PageHeader from "../components/PageHeader"
import WhatsAppIcon from "../components/WhatsAppIcon"
import site from "../data/site"
import InstagramIcon from "../components/InstagramIcon"

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="We'd Love to Hear from You"
        image="/gallery/hero.jpg"
        crumb="Contact"
      />

      <section className="section contact-grid">
        <div>
          <h2 className="title-line">Get in Touch</h2>
          <p className="contact-intro">
            Message us to check dates, ask about arrangements or schedule a visit to see both
            spaces. We're happy to help you plan.
          </p>

          <a href={site.whatsappLink} target="_blank" rel="noreferrer" className="contact-whatsapp">
            <WhatsAppIcon size={22} />
            Chat on WhatsApp
          </a>

          <a href={`tel:${site.phone}`} className="contact-card">
            <Phone size={22} />
            <span>
              <strong>Call Us</strong>
              {site.phone}
            </span>
          </a>

          {site.email && (
            <a href={`mailto:${site.email}`} className="contact-card">
              <Mail size={22} />
              <span>
                <strong>Send an Email</strong>
                {site.email}
              </span>
            </a>
          )}

          {site.instagram && (
            <a href={site.instagram} target="_blank" rel="noreferrer" className="contact-card">
              <InstagramIcon size={22} />
              <span>
                <strong>Follow Us</strong>
                See our latest events on Instagram
              </span>
            </a>
          )}
          
        </div>


        <div>
          <h2 className="title-line">Our Location</h2>

          <iframe
            className="contact-map"
            src={site.mapEmbed}
            title="Map showing the location of Signature Hall, Kannur"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>

          <p className="contact-address">
            <MapPin size={20} />
            <span>{site.address}</span>
          </p>
          <a href={site.mapLink} target="_blank" rel="noreferrer" className="outline-button">
            Get Directions →
          </a>
        </div>
      </section>
    </>
  )
}

export default ContactPage