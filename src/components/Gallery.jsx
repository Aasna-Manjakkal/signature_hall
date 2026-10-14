import { useState } from "react"
import gallery from "../data/gallery"

const filters = ["All", "Upper Hall", "Covered Ground", "Open Ground"]

function Gallery() {
  const [selected, setSelected] = useState("All")

  const photos = selected === "All"
    ? gallery
    : gallery.filter((photo) => photo.space === selected)

  return (
<section className="section" id="gallery">      <h2>Gallery</h2>

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