import site from "../data/site"

function Contact() {
  return (
    <section>
      <h2>Visit or Contact Us</h2>
      <p><strong>Address:</strong> {site.address}</p>
      <p><strong>Phone:</strong> <a href={`tel:${site.phone}`}>{site.phone}</a></p>
      <p>
        <a href={site.mapLink} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
      </p>
    </section>
  )
}

export default Contact