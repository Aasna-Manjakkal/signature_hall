import { useState } from "react"
import gallery from "../data/gallery"

const filters = ["All", "Upper Hall", "Covered Ground", "Open Ground"]

function Gallery() {
  const [selected, setSelected] = useState("All")

  const photos = selected === "All"
    ? gallery
    : gallery.filter((photo) => photo.space === selected)

  return (
    <section>
      <h2>Gallery</h2>

      <div>
        {filters.map((name) => (
          <button key={name} onClick={() => setSelected(name)}>
            {name}
          </button>
        ))}
      </div>

      <div>
        {photos.map((photo) => (
          <img key={photo.id} src={photo.src} alt={photo.alt} width="300" />
        ))}
      </div>
    </section>
  )
}

export default Gallery