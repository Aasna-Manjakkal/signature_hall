import { useState } from "react"
import gallery from "../data/gallery"

const filters = ["All", "Weddings", "Receptions", "Meetings", "Decorations"]

function Gallery() {
  const [selected, setSelected] = useState("All")

  const photos = selected === "All"
    ? gallery
    : gallery.filter((photo) => photo.category === selected)

  return (
    <section className="section" id="gallery">
      <div className="section-heading">
        <p className="eyebrow">Gallery</p>
        <h2>Moments from <span>Signature Hall</span></h2>
      </div>

      <div className="filters">
        {filters.map((name) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={name === selected ? "filter active" : "filter"}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {photos.map((photo) => (
          <img key={photo.id} src={photo.src} alt={photo.alt} />
        ))}
      </div>
    </section>
  )
}

export default Gallery