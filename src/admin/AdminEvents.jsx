import { useEffect, useMemo, useState } from "react"
import { apiFetch } from "../lib/api"
import { SPACES, formatDate, toISODate } from "./options"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function buildMonth(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const cells = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)
  return cells
}

function EventForm({ initialDate, onCreated, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    space: "",
    event_date: initialDate,
    guests: "",
    notes: "",
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
        body: JSON.stringify(form),
      })
      onCreated(result.event)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className="admin-card admin-form-grid" onSubmit={handleSubmit}>
      <h2>Add an event</h2>

      <div className="admin-form-full">
        <label htmlFor="ev-title">Title *</label>
        <input
          id="ev-title"
          name="title"
          placeholder="e.g. Wedding – Rahul & Anjali"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="ev-space">Space *</label>
        <select id="ev-space" name="space" value={form.space} onChange={handleChange} required>
          <option value="">Choose…</option>
          {SPACES.map((space) => (
            <option key={space} value={space}>{space}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ev-date">Date *</label>
        <input id="ev-date" name="event_date" type="date" value={form.event_date} onChange={handleChange} required />
      </div>

      <div>
        <label htmlFor="ev-guests">Guests (approx.)</label>
        <input id="ev-guests" name="guests" type="number" min="1" step="1" value={form.guests} onChange={handleChange} />
      </div>

      <div className="admin-form-full">
        <label htmlFor="ev-notes">Notes</label>
        <textarea id="ev-notes" name="notes" rows="2" value={form.notes} onChange={handleChange} />
      </div>

      {error && <p className="admin-error admin-form-full">{error}</p>}

      <div className="admin-form-full admin-form-actions">
        <button type="submit" className="button" disabled={saving}>
          {saving ? "Saving…" : "Save event"}
        </button>
        <button type="button" className="button-plain" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function AdminEvents() {
  const today = new Date()
  const todayISO = toISODate(today.getFullYear(), today.getMonth(), today.getDate())

  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formDate, setFormDate] = useState(null)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const from = toISODate(year, month, 1)
  const to = toISODate(year, month, daysInMonth)

  useEffect(() => {
    let ignore = false
    apiFetch(`/api/events?from=${from}&to=${to}`)
      .then((data) => {
        if (!ignore) setEvents(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [from, to])

  const eventsByDate = useMemo(() => {
    const map = {}
    for (const event of events) {
      if (!map[event.event_date]) map[event.event_date] = []
      map[event.event_date].push(event)
    }
    return map
  }, [events])

  const cells = buildMonth(year, month)
  const monthName = new Date(year, month, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" })

  function goToMonth(newYear, newMonth) {
    if (newYear === year && newMonth === month) return
    setYear(newYear)
    setMonth(newMonth)
    setLoading(true)
    setError("")
    setFormDate(null)
  }

  function changeMonth(step) {
    const next = new Date(year, month + step, 1)
    goToMonth(next.getFullYear(), next.getMonth())
  }

  function handleCreated(event) {
    if (event.event_date >= from && event.event_date <= to) {
      setEvents((current) =>
        [...current, event].sort((a, b) => a.event_date.localeCompare(b.event_date))
      )
    }
    setFormDate(null)
  }

  async function handleDelete(event) {
    const linked = event.enquiry_id ? " The linked enquiry will go back to “Contacted”." : ""
    if (!window.confirm(`Remove "${event.title}" from the calendar?${linked}`)) return
    try {
      await apiFetch(`/api/events/${event.id}`, { method: "DELETE" })
      setEvents((current) => current.filter((e) => e.id !== event.id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1>Calendar</h1>
          <p className="admin-muted">Click a date to add an event. Booked enquiries appear here automatically.</p>
        </div>
        {!formDate && (
          <button className="button" onClick={() => setFormDate(todayISO)}>
            + Add event
          </button>
        )}
      </div>

      {formDate && (
        <EventForm
          key={formDate}
          initialDate={formDate}
          onCreated={handleCreated}
          onCancel={() => setFormDate(null)}
        />
      )}

      <div className="calendar-nav">
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
        <h2>{monthName}</h2>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
        <button type="button" className="calendar-today" onClick={() => goToMonth(today.getFullYear(), today.getMonth())}>
          Today
        </button>
        <div className="calendar-legend">
          {SPACES.map((space) => (
            <span key={space} className="calendar-chip" data-space={space}>{space}</span>
          ))}
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className={loading ? "calendar loading" : "calendar"}>
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}

        {cells.map((day, index) => {
          if (!day) return <div key={`blank-${index}`} className="calendar-cell blank" />

          const iso = toISODate(year, month, day)
          const dayEvents = eventsByDate[iso] || []
          const full = SPACES.every((space) => dayEvents.some((e) => e.space === space))

          let className = "calendar-cell"
          if (iso === todayISO) className += " today"
          if (full) className += " full"

          return (
            <button
              key={iso}
              type="button"
              className={className}
              onClick={() => setFormDate(iso)}
              disabled={full}
              aria-label={`${formatDate(iso)}: ${dayEvents.length} event(s)${full ? ", fully booked" : ""}`}
            >
              <span className="calendar-day">{day}</span>
              {dayEvents.map((event) => (
                <span key={event.id} className="calendar-chip" data-space={event.space} title={event.title}>
                  {event.title}
                </span>
              ))}
            </button>
          )
        })}
      </div>

      <h2 className="admin-section-title">Events in {monthName}</h2>

      {!loading && events.length === 0 && <p className="admin-muted">No events this month.</p>}

      {events.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Space</th>
                <th>Guests</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{formatDate(event.event_date)}</td>
                  <td>
                    <strong>{event.title}</strong>
                    {event.enquiry_id && <div className="admin-muted">From an enquiry</div>}
                  </td>
                  <td>
                    <span className="calendar-chip" data-space={event.space}>{event.space}</span>
                  </td>
                  <td>{event.guests ?? "—"}</td>
                  <td className="admin-notes">{event.notes || "—"}</td>
                  <td>
                    <button className="button-danger" onClick={() => handleDelete(event)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminEvents