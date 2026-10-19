import { Router } from "express"
import rateLimit from "express-rate-limit"
import supabase from "../supabase.js"

const router = Router()

const EVENT_TYPES = [
  "page_view",
  "whatsapp_click",
  "call_click",
  "email_click",
  "instagram_click",
  "directions_click",
]
const DEVICES = ["mobile", "desktop"]

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests" },
})

function shortText(value, max) {
  if (typeof value !== "string") return null
  const text = value.trim().slice(0, max)
  return text === "" ? null : text
}

router.post("/", limiter, async (req, res) => {
  const body = req.body ?? {}
  const page = shortText(body.page, 100)

  if (!EVENT_TYPES.includes(body.event_type)) {
    return res.status(400).json({ error: "Unknown event type" })
  }
  if (!page || !page.startsWith("/") || page.startsWith("/admin")) {
    return res.status(400).json({ error: "Invalid page" })
  }

  const { error } = await supabase.from("page_events").insert({
    event_type: body.event_type,
    page,
    detail: shortText(body.detail, 80),
    device: DEVICES.includes(body.device) ? body.device : null,
    referrer: shortText(body.referrer, 100),
  })

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not record the visit" })
  }

  res.status(204).end()
})

export default router