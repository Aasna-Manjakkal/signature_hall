import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api"
import { STATUSES, SPACES, SOURCES, EVENT_TYPES, formatDate, whatsappNumber } from "./options"

const EMPTY_FORM = {
  customer_name: "",
  phone: "",
  event_type: "",
  space: "",
  event_date: "",
  guests: "",
  source: "WhatsApp",
  notes: "",
}

function EnquiryForm({ onCreated, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSaving(true)
    try {
      const created = await apiFetch("/api/enquiries", {
        method: "POST",
        body: JSON.stringify(form),
      })
      onCreated(created)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="admin-card admin-form-grid" onSubmit={handleSubmit}>
      <h2>Log an enquiry</h2>

      <div>
        <label htmlFor="customer_name">Customer name *</label>
        <input id="customer_name" name="customer_name" value={form.customer_name} onChange={handleChange} required />
      </div>

      <div>
        <label htmlFor="phone">Phone *</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
      </div>

      <div>
        <label htmlFor="event_type">Event type</label>
        <select id="event_type" name="event_type" value={form.event_type} onChange={handleChange}>
          <option value="">Not sure yet</option>
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="space">Space</label>
        <select id="space" name="space" value={form.space} onChange={handleChange}>
          <option value="">Not sure yet</option>
          {SPACES.map((space) => (
            <option key={space} value={space}>{space}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="event_date">Event date</label>
        <input id="event_date" name="event_date" type="date" value={form.event_date} onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="guests">Guests (approx.)</label>
        <input id="guests" name="guests" type="number" min="1" step="1" value={form.guests} onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="source">How did they contact us?</label>
        <select id="source" name="source" value={form.source} onChange={handleChange}>
          {SOURCES.map((source) => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </div>

      <div className="admin-form-full">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          placeholder="e.g. Wants stage décor in white and gold, will visit on Saturday"
          value={form.notes}
          onChange={handleChange}
        />
      </div>

      {error && <p className="admin-error admin-form-full">{error}</p>}

      <div className="admin-form-full admin-form-actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? "Saving…" : "Save enquiry"}
        </button>
        <button type="button" className="button-plain" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function BookingForm({ enquiry, onBooked, onCancel }) {
  const [form, setForm] = useState({
    title: `${enquiry.event_type || "Event"} – ${enquiry.customer_name}`,
    space: enquiry.space || "",
    event_date: enquiry.event_date || "",
    guests: enquiry.guests ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSaving(true)
    try {
      const result = await apiFetch("/api/events", {
        method: "POST",
        body: JSON.stringify({ ...form, enquiry_id: enquiry.id }),
      })
      onBooked(result.enquiry)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <p className="booking-form-title">Confirm the booking. This adds it to the calendar.</p>

      <div className="booking-form-fields">
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Space
          <select name="space" value={form.space} onChange={handleChange} required>
            <option value="">Choose…</option>
            {SPACES.map((space) => (
              <option key={space} value={space}>{space}</option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input name="event_date" type="date" value={form.event_date} onChange={handleChange} required />
        </label>
        <label>
          Guests
          <input name="guests" type="number" min="1" step="1" value={form.guests} onChange={handleChange} />
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="booking-actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? "Booking…" : "Confirm booking"}
        </button>
        <button type="button" className="button-plain" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function EnquiryRow({ enquiry, onUpdated, onDeleted }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [booking, setBooking] = useState(false)

  async function changeStatus(status) {
    setError("")

    if (status === "booked") {
      setBooking(true)
      return
    }

    if (
      enquiry.status === "booked" &&
      !window.confirm("This enquiry is booked. Changing its status will remove the booking from the calendar. Continue?")
    ) {
      return
    }

    setBusy(true)
    try {
      const updated = await apiFetch(`/api/enquiries/${enquiry.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
      onUpdated(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function handleBooked(updated) {
    setBooking(false)
    onUpdated(updated)
  }

  async function handleDelete() {
    if (!window.confirm(`Delete the enquiry from ${enquiry.customer_name}? This can't be undone.`)) return
    setBusy(true)
    try {
      await apiFetch(`/api/enquiries/${enquiry.id}`, { method: "DELETE" })
      onDeleted(enquiry.id)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const shownStatus = booking ? "booked" : enquiry.status

  return (
    <>
      <tr>
        <td>{formatDate(enquiry.created_at)}</td>
        <td>
          <strong>{enquiry.customer_name}</strong>
          <div className="admin-contact-links">
            <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>
            <a href={`https://wa.me/${whatsappNumber(enquiry.phone)}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </td>
        <td>
          {enquiry.event_type || "—"}
          <div className="admin-muted">{enquiry.space || "Space not chosen"}</div>
        </td>
        <td>{formatDate(enquiry.event_date)}</td>
        <td>{enquiry.guests ?? "—"}</td>
        <td>{enquiry.source || "—"}</td>
        <td>
          <select
            className="status-select"
            data-status={shownStatus}
            value={shownStatus}
            onChange={(e) => changeStatus(e.target.value)}
            disabled={busy || booking}
            aria-label={`Status for ${enquiry.customer_name}`}
          >
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          {error && <p className="admin-error">{error}</p>}
        </td>
        <td className="admin-notes">{enquiry.notes || "—"}</td>
        <td>
          <button className="button-danger" onClick={handleDelete} disabled={busy}>
            Delete
          </button>
        </td>
      </tr>

      {booking && (
        <tr className="booking-row">
          <td colSpan="9">
            <BookingForm enquiry={enquiry} onBooked={handleBooked} onCancel={() => setBooking(false)} />
          </td>
        </tr>
      )}
    </>
  )
}

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    apiFetch("/api/enquiries")
      .then(setEnquiries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const counts = STATUSES.reduce((totals, status) => {
    totals[status.value] = enquiries.filter((e) => e.status === status.value).length
    return totals
  }, {})

  const shown = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter)

  function handleCreated(created) {
    setEnquiries((current) => [created, ...current])
    setShowForm(false)
  }

  function handleUpdated(updated) {
    setEnquiries((current) => current.map((e) => (e.id === updated.id ? updated : e)))
  }

  function handleDeleted(id) {
    setEnquiries((current) => current.filter((e) => e.id !== id))
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1>Enquiries</h1>
          <p className="admin-muted">Log every enquiry and update its status as it progresses.</p>
        </div>
        {!showForm && (
          <button className="button" onClick={() => setShowForm(true)}>
            + Log an enquiry
          </button>
        )}
      </div>

      {showForm && <EnquiryForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />}

      <div className="status-tabs">
        <button
          className={filter === "all" ? "status-tab active" : "status-tab"}
          onClick={() => setFilter("all")}
        >
          All <span>{enquiries.length}</span>
        </button>
        {STATUSES.map((status) => (
          <button
            key={status.value}
            className={filter === status.value ? "status-tab active" : "status-tab"}
            onClick={() => setFilter(status.value)}
          >
            {status.label} <span>{counts[status.value]}</span>
          </button>
        ))}
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-muted">Loading enquiries…</p>}
      {!loading && shown.length === 0 && (
        <p className="admin-muted">No enquiries here yet. Use "Log an enquiry" to add the first one.</p>
      )}

      {shown.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Customer</th>
                <th>Event</th>
                <th>Event date</th>
                <th>Guests</th>
                <th>Source</th>
                <th>Status</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((enquiry) => (
                <EnquiryRow
                  key={enquiry.id}
                  enquiry={enquiry}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminEnquiries