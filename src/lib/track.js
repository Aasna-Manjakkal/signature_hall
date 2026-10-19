const API_URL = import.meta.env.VITE_API_URL

let lastPath = null
let firstView = true

function externalReferrer() {
  if (!document.referrer) return null
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "")
    return host === window.location.hostname ? null : host
  } catch {
    return null
  }
}

function send(eventType, detail = null, extra = {}) {
  const page = window.location.pathname
  if (page.startsWith("/admin")) return

  fetch(`${API_URL}/api/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type: eventType,
      page,
      detail,
      device: window.innerWidth < 760 ? "mobile" : "desktop",
      ...extra,
    }),
    keepalive: true,
  }).catch(() => {})
}

export function trackPageView(path) {
  if (path === lastPath) return
  lastPath = path

  const extra = firstView ? { referrer: externalReferrer() } : {}
  firstView = false
  send("page_view", null, extra)
}

export function trackLinkClick(link) {
  const href = link.getAttribute("href") || ""
  let type = null

  if (href.includes("wa.me") || href.includes("whatsapp.com")) type = "whatsapp_click"
  else if (href.startsWith("tel:")) type = "call_click"
  else if (href.startsWith("mailto:")) type = "email_click"
  else if (href.includes("instagram.com")) type = "instagram_click"
  else if (href.includes("google.com/maps") || href.includes("maps.app.goo.gl") || href.includes("goo.gl/maps")) {
    type = "directions_click"
  }

  if (!type) return
  const firstLine = link.innerText.split("\n")[0].trim()
  const label = link.getAttribute("aria-label") || firstLine || "Icon"
  send(type, label.slice(0, 80))
}