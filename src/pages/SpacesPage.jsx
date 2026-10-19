import PageHeader from "../components/PageHeader"
import WhatsAppIcon from "../components/WhatsAppIcon"
import spaces from "../data/spaces"
import site from "../data/site"

function SpacesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Spaces"
        title="Designed for Your Celebrations"
        image="/gallery/haldi.png"
      
        crumb="Our Spaces"
      />

      <section className="section">
        {spaces.map((space) => {
          const message = `Hello, I would like to enquire about booking the ${space.name} at Signature Hall.`
          const link = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`

          return (
            <article className="space-row" key={space.id}>
              <img src={space.image} alt={space.name} />

              <div className="space-row-body">
                <h2>{space.name}</h2>
                <p className="space-subtitle">{space.bestFor}</p>
                <p>{space.details}</p>

                <ul className="highlights">
                  {space.highlights.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.label}>
                        <Icon size={26} strokeWidth={1.5} />
                        <span>{item.label}</span>
                      </li>
                    )
                  })}
                </ul>

                <a href={link} target="_blank" rel="noreferrer" className="button whatsapp-enquire">
                  <WhatsAppIcon size={18} />
                  Enquire via WhatsApp
                </a>
              </div>
            </article>
          )
        })}
      </section>
    </>
  )
}

export default SpacesPage