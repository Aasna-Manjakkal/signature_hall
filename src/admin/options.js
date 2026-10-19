export const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "visited", label: "Visited" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
]

export const SPACES = ["Upper Floor", "Ground Floor"]

export const SOURCES = ["WhatsApp", "Phone call", "Walk-in", "Instagram", "Website", "Referral", "Other"]

export const EVENT_TYPES = [
  "Wedding",
  "Reception",
  "Engagement",
  "Birthday",
  "Meeting",
  "Family function",
  "Other",
]

export function formatDate(value) {
  if (!value) return "—"
  const date = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value)
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function whatsappNumber(phone) {
  const digits = phone.replace(/\D/g, "")
  return digits.length === 10 ? `91${digits}` : digits
}

export function toISODate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}