import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const filters = ["All", "Weddings", "Receptions", "Meetings", "Other"]
const API_URL = import.meta.env.VITE_API_URL

function Gallery({ showHeading = true, limit, large = false }) {
  const [gallery, setGallery] = useState([])
  const [status, setStatus] = useState("loading")
  const [selected, setSelected] = useState("All")
  const [openPhoto, setOpenPhoto] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then((response) => {
        if (!response.ok) throw new Error("Request failed")
        return response.json()
      })
      .then((data) => {
        setGallery(data)
        setStatus("ready")
      })
      .catch(() => setStatus("error"))
  }, [])

  useEffect(() => {
    if (!openPhoto) return

    function handleKey(event) {
      if (event.key === "Escape") setOpenPhoto(null)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [openPhoto])

  const photos = selected === "All"
    ? gallery
    : gallery.filter((photo) => photo.category === selected)

  const shown = limit ? photos.slice(0, limit) : photos

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

      {status === "loading" && <p className="gallery-status">Loading photos…</p>}
      {status === "error" && (
        <p className="gallery-status">Photos couldn't be loaded right now. Please try again later.</p>
      )}
      {status === "ready" && shown.length === 0 && (
        <p className="gallery-status">New photos coming soon.</p>
      )}

      <div className={large ? "gallery-grid large" : "gallery-grid"}>
        {shown.map((photo) => (
          <button
            key={photo.id}
            className="gallery-item"
            onClick={() => setOpenPhoto(photo)}
          >
            <img src={photo.image_url} alt={photo.alt} loading="lazy" />
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
          <img src={openPhoto.image_url} alt={openPhoto.alt} />
          <p>{openPhoto.alt}</p>
          <button className="lightbox-close" aria-label="Close">×</button>
        </div>
      )}
    </section>
  )
}

export default Gallery