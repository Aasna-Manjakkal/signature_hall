import { Router } from "express"
import supabase from "../supabase.js"
import requireAdmin from "../middleware/requireAdmin.js"

const router = Router()

router.use(requireAdmin)

const STATUSES = ["new", "contacted", "visited", "booked", "lost"]
const SPACES = ["Upper Floor", "Ground Floor"]
const SOURCES = ["WhatsApp", "Phone call", "Walk-in", "Instagram", "Website", "Referral", "Other"]
const FIELDS =
  "id, created_at, customer_name, phone, event_type, space, event_date, guests, source, status, notes"

function cleanText(value) {
  if (value === undefined) return undefined
  const text = String(value).trim()
  return text === "" ? null : text
}

function validate(body, isNew) {
  const values = {}
  const errors = []
  const has = (key) => body[key] !== undefined

  if (isNew || has("customer_name")) {
    const name = cleanText(body.customer_name)
    if (!name) errors.push("Customer name is required")
    else values.customer_name = name
  }

  if (isNew || has("phone")) {
    const phone = cleanText(body.phone)
    if (!phone) errors.push("Phone number is required")
    else if (phone.replace(/\D/g, "").length < 7) errors.push("Phone number looks too short")
    else values.phone = phone
  }

  if (has("event_type")) values.event_type = cleanText(body.event_type)

  if (has("space")) {
    const space = cleanText(body.space)
    if (space && !SPACES.includes(space)) errors.push("Please choose a valid space")
    else values.space = space
  }

  if (has("event_date")) {
    const date = cleanText(body.event_date)
    if (date && Number.isNaN(Date.parse(date))) errors.push("Event date is not a valid date")
    else values.event_date = date
  }

  if (has("guests")) {
    const guests = cleanText(body.guests)
    if (guests === null) {
      values.guests = null
    } else {
      const number = Number(guests)
      if (!Number.isInteger(number) || number < 1) errors.push("Guests must be a whole number above 0")
      else values.guests = number
    }
  }

  if (has("source")) {
    const source = cleanText(body.source)
    if (source && !SOURCES.includes(source)) errors.push("Please choose a valid source")
    else values.source = source
  }

  if (has("status")) {
    if (!STATUSES.includes(body.status)) errors.push("Please choose a valid status")
    else values.status = body.status
  }

  if (has("notes")) values.notes = cleanText(body.notes)

  return { values, errors }
}

// List enquiries, newest first (optionally filtered by status)
router.get("/", async (req, res) => {
  let query = supabase
    .from("enquiries")
    .select(FIELDS)
    .order("created_at", { ascending: false })

  if (req.query.status) {
    if (!STATUSES.includes(req.query.status)) {
      return res.status(400).json({ error: "Unknown status" })
    }
    query = query.eq("status", req.query.status)
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not load enquiries" })
  }

  res.json(data)
})

// Log a new enquiry
router.post("/", async (req, res) => {
  const { values, errors } = validate(req.body, true)

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(". ") })
  }

  const { data, error } = await supabase
    .from("enquiries")
    .insert(values)
    .select(FIELDS)
    .single()

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not save the enquiry" })
  }

  res.status(201).json(data)
})

// Update an enquiry (status, notes or any other field)
router.patch("/:id", async (req, res) => {
  const { values, errors } = validate(req.body, false)

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(". ") })
  }
  if (values.status === "booked") {
    return res.status(400).json({ error: "Use the booking form to mark an enquiry as booked" })
  }
  if (Object.keys(values).length === 0) {
    return res.status(400).json({ error: "Nothing to update" })
  }

  const { data, error } = await supabase
    .from("enquiries")
    .update(values)
    .eq("id", req.params.id)
    .select(FIELDS)
    .single()

  if (error?.code === "PGRST116") {
    return res.status(404).json({ error: "Enquiry not found" })
  }
  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not update the enquiry" })
  }

  // Moving away from "booked" cancels the booking and frees the date
  if (values.status) {
    const { error: eventError } = await supabase.from("events").delete().eq("enquiry_id", req.params.id)
    if (eventError) console.error(eventError)
  }

  res.json(data)
})

// Delete an enquiry (for mistakes or duplicates)
router.delete("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("enquiries")
    .delete()
    .eq("id", req.params.id)
    .select("id")

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not delete the enquiry" })
  }
  if (data.length === 0) {
    return res.status(404).json({ error: "Enquiry not found" })
  }

  res.status(204).end()
})

export default router