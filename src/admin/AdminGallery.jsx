import { useEffect, useMemo, useState } from "react"
import { apiFetch } from "../lib/api"

const CATEGORIES = ["Weddings", "Receptions", "Meetings", "Other"]
const MAX_SIZE = 5 * 1024 * 1024

function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [alt, setAlt] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  const [inputKey, setInputKey] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function handleFileChange(event) {
    const chosen = event.target.files[0] || null
    setError("")
    if (chosen && chosen.size > MAX_SIZE) {
      setError("This photo is over 5 MB. Please shrink it first, for example at squoosh.app.")
      setFile(null)
      setInputKey((key) => key + 1)
      return
    }
    setFile(chosen)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!file) {
      setError("Please choose a photo.")
      return
    }

    const formData = new FormData()
    formData.append("photo", file)
    formData.append("category", category)
    formData.append("alt", alt)
    formData.append("sort_order", sortOrder)

    setUploading(true)
    try {
      const photo = await apiFetch("/api/gallery", { method: "POST", body: formData })
      onUploaded(photo)
      setFile(null)
      setAlt("")
      setSortOrder(0)
      setInputKey((key) => key + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form className="admin-card admin-upload" onSubmit={handleSubmit}>
      <div className="admin-upload-preview">
        {preview ? <img src={preview} alt="Preview of the selected photo" /> : <span>No photo selected</span>}
      </div>

      <div className="admin-upload-fields">
        <h2>Add a photo</h2>

        <label htmlFor="photo">Photo (JPG, PNG or WebP, up to 5 MB)</label>
        <input
          key={inputKey}
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />

        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <label htmlFor="alt">Description</label>
        <input
          id="alt"
          type="text"
          placeholder="e.g. Wedding stage with red roses on the ground floor"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          required
        />

        <label htmlFor="sort-order">Order (lower numbers show first)</label>
        <input
          id="sort-order"
          type="number"
          step="1"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" className="button" disabled={uploading}>
          {uploading ? "Uploading…" : "Upload photo"}
        </button>
      </div>
    </form>
  )
}

function PhotoCard({ photo, onSaved, onDeleted }) {
  const [category, setCategory] = useState(photo.category)
  const [alt, setAlt] = useState(photo.alt)
  const [sortOrder, setSortOrder] = useState(photo.sort_order)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const changed =
    category !== photo.category ||
    alt !== photo.alt ||
    Number(sortOrder) !== photo.sort_order

  async function handleSave() {
    setError("")
    setBusy(true)
    try {
      const updated = await apiFetch(`/api/gallery/${photo.id}`, {
        method: "PATCH",
        body: JSON.stringify({ category, alt, sort_order: Number(sortOrder) }),
      })
      onSaved(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this photo from the gallery? This can't be undone.")) return
    setError("")
    setBusy(true)
    try {
      await apiFetch(`/api/gallery/${photo.id}`, { method: "DELETE" })
      onDeleted(photo.id)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <article className="admin-photo">
      <img src={photo.image_url} alt={photo.alt} />
      <div className="admin-photo-fields">
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input value={alt} onChange={(e) => setAlt(e.target.value)} aria-label="Description" />
        <input
          type="number"
          step="1"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          aria-label="Order"
        />

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-photo-actions">
          <button className="button" onClick={handleSave} disabled={!changed || busy}>
            Save
          </button>
          <button className="button-danger" onClick={handleDelete} disabled={busy}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

function AdminGallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    apiFetch("/api/gallery")
      .then(setPhotos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function sortPhotos(list) {
    return [...list].sort((a, b) => a.sort_order - b.sort_order)
  }

  function handleUploaded(photo) {
    setPhotos((current) => sortPhotos([photo, ...current]))
    setNotice("Photo uploaded. It's now live in the gallery.")
  }

  function handleSaved(updated) {
    setPhotos((current) => sortPhotos(current.map((p) => (p.id === updated.id ? updated : p))))
    setNotice("Changes saved.")
  }

  function handleDeleted(id) {
    setPhotos((current) => current.filter((p) => p.id !== id))
    setNotice("Photo deleted.")
  }

  return (
    <div>
      <h1>Gallery</h1>
      <p className="admin-muted">Photos added here appear on the website's gallery straight away.</p>

      <UploadForm onUploaded={handleUploaded} />

      {notice && <p className="admin-notice">{notice}</p>}
      {error && <p className="admin-error">{error}</p>}

      <h2 className="admin-section-title">
        {loading ? "Loading photos…" : `${photos.length} photo${photos.length === 1 ? "" : "s"}`}
      </h2>

      <div className="admin-gallery-grid">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onSaved={handleSaved}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    </div>
  )
}

export default AdminGallery