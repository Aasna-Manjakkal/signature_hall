import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiFetch } from "../lib/api"
import { formatDate, toISODate } from "./options"

const RANGES = [7, 30, 90]

const PAGE_NAMES = {
  "/": "Home",
  "/spaces": "Spaces",
  "/gallery": "Gallery",
  "/about": "About",
  "/contact": "Contact",
}

const CLICK_NAMES = {
  whatsapp_click: "WhatsApp",
  call_click: "Call",
  email_click: "Email",
  instagram_click: "Instagram",
  directions_click: "Directions",
}

const DEVICE_NAMES = { mobile: "Phone", desktop: "Computer", unknown: "Unknown" }

function lastDays(count) {
  const today = new Date()
  const days = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    days.push(toISODate(d.getFullYear(), d.getMonth(), d.getDate()))
  }
  return days
}

function StatTile({ label, value, note }) {
  return (
    <div className="stat-tile">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value.toLocaleString("en-IN")}</p>
      {note && <p className="stat-note">{note}</p>}
    </div>
  )
}

function BarList({ title, rows, empty = "No data yet" }) {
  const max = Math.max(1, ...rows.map((row) => row.value))

  return (
    <div className="admin-card dashboard-card">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="admin-muted">{empty}</p>
      ) : (
        <ul className="bar-list">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="bar-list-label">
                <span>{row.label}</span>
                <strong>{row.value.toLocaleString("en-IN")}</strong>
              </div>
              <div className="bar-list-track">
                <div className="bar-list-fill" style={{ width: `${(row.value / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DailyChart({ daily, days }) {
  const byDay = Object.fromEntries(daily.map((d) => [d.day, d.views]))
  const series = lastDays(days).map((day) => ({ day, views: byDay[day] ?? 0 }))
  const max = Math.max(1, ...series.map((s) => s.views))
  const total = series.reduce((sum, s) => sum + s.views, 0)

  return (
    <div className="admin-card dashboard-card dashboard-wide">
      <h2>Page views per day</h2>
      <div
        className="daily-chart"
        role="img"
        aria-label={`${total} page views over the last ${days} days. Busiest day: ${max} views.`}
      >
        {series.map((s) => (
          <div
            key={s.day}
            className="daily-bar"
            style={{ height: `${(s.views / max) * 100}%` }}
            title={`${formatDate(s.day)}: ${s.views} views`}
          />
        ))}
      </div>
      <div className="daily-axis">
        <span>{formatDate(series[0].day)}</span>
        <span>Busiest day: {max === 1 && total === 0 ? 0 : max}</span>
        <span>{formatDate(series[series.length - 1].day)}</span>
      </div>
    </div>
  )
}

function AdminHome() {
  const [days, setDays] = useState(30)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false
    apiFetch(`/api/stats?days=${days}`)
      .then((data) => {
        if (!ignore) {
          setStats(data)
          setError("")
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [days])

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-muted">How the website and enquiries are doing.</p>
        </div>
        <div className="status-tabs">
          {RANGES.map((range) => (
            <button
              key={range}
              className={days === range ? "status-tab active" : "status-tab"}
              onClick={() => setDays(range)}
            >
              Last {range} days
            </button>
          ))}
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {!stats && !error && <p className="admin-muted">Loading statistics…</p>}

      {stats && (
        <>
          <div className="stat-grid">
            <StatTile label="Page views" value={stats.totals.page_view ?? 0} />
            <StatTile label="WhatsApp clicks" value={stats.totals.whatsapp_click ?? 0} />
            <StatTile label="Call clicks" value={stats.totals.call_click ?? 0} />
            <StatTile label="Enquiries logged" value={stats.enquiries} />
            <StatTile
              label="Bookings"
              value={stats.booked}
              note={
                stats.enquiries > 0
                  ? `${Math.round((stats.booked / stats.enquiries) * 100)}% of enquiries`
                  : "No enquiries yet"
              }
            />
          </div>

          <div className="dashboard-grid">
            <DailyChart daily={stats.daily} days={days} />

            <BarList
              title="Top pages"
              rows={stats.pages.map((p) => ({ label: PAGE_NAMES[p.page] || p.page, value: p.views }))}
            />

            <BarList
              title="Where visitors came from"
              rows={stats.referrers.map((r) => ({ label: r.referrer, value: r.visits }))}
              empty="No outside websites yet. Typed addresses and app links don't show a source."
            />

            <BarList
              title="Phone or computer"
              rows={Object.entries(stats.devices).map(([device, count]) => ({
                label: DEVICE_NAMES[device] || device,
                value: count,
              }))}
            />

            <BarList
              title="Most-clicked buttons"
              rows={stats.buttons.map((b) => ({
                label: `${CLICK_NAMES[b.event_type] || b.event_type} · ${b.detail || "—"}`,
                value: b.clicks,
              }))}
            />

            <div className="admin-card dashboard-card">
              <h2>Upcoming events</h2>
              {stats.upcoming.length === 0 ? (
                <p className="admin-muted">Nothing booked yet.</p>
              ) : (
                <ul className="upcoming-list">
                  {stats.upcoming.map((event) => (
                    <li key={`${event.event_date}-${event.space}`}>
                      <span className="upcoming-date">{formatDate(event.event_date)}</span>
                      <span>
                        <strong>{event.title}</strong>
                        <span className="calendar-chip" data-space={event.space}>{event.space}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/admin/calendar" className="dashboard-link">Open calendar →</Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminHome