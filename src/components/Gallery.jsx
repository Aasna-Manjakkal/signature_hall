import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import gallery from "../data/gallery"

const filters = ["All", "Weddings", "Receptions", "Meetings", "Decorations"]

function Gallery({ showHeading = true, limit, large = false }) {
  const [selected, setSelected] = useState("All")
  const [openPhoto, setOpenPhoto] = useState(null)

  const photos = selected === "All"
    ? gallery
    : gallery.filter((photo) => photo.category === selected)

  const shown = limit ? photos.slice(0, limit) : photos

  useEffect(() => {
    if (!openPhoto) return

    function handleKey(event) {
      if (event.key === "Escape") setOpenPhoto(null)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [openPhoto])

  return (
    <section className="section" id="gallery">
      {showHeading && (
        <div className="section-heading">
          <p className="eyebrow">Gallery</p>
          <h2>Moments from <span>Signature Hall</span></h2>
        </div>
      )}

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

      <div className={large ? "gallery-grid large" : "gallery-grid"}>
        {shown.map((photo) => (
          <button
            key={photo.id}
            className="gallery-item"
            onClick={() => setOpenPhoto(photo)}
          >
            <img src={photo.src} alt={photo.alt} />
          </button>
        ))}
      </div>

      {limit && gallery.length > limit && (
        <div className="view-more">
          <Link to="/gallery" className="outline-button">View More Photos →</Link>
        </div>
      )}

      {openPhoto && (
        <div className="lightbox" onClick={() => setOpenPhoto(null)}>
          <img src={openPhoto.src} alt={openPhoto.alt} />
          <p>{openPhoto.alt}</p>
          <button className="lightbox-close" aria-label="Close">×</button>
        </div>
      )}
    </section>
  )
}

export default Gallery