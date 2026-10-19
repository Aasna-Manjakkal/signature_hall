import { Router } from "express"
import supabase from "../supabase.js"
import requireAdmin from "../middleware/requireAdmin.js"

const router = Router()

router.use(requireAdmin)

const SPACES = ["Upper Floor", "Ground Floor"]
const FIELDS = "id, created_at, enquiry_id, title, space, event_date, guests, notes"
const ENQUIRY_FIELDS =
  "id, created_at, customer_name, phone, event_type, space, event_date, guests, source, status, notes"
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function readableDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
}

function validate(body) {
  const errors = []
  const title = String(body.title ?? "").trim()
  const space = body.space
  const event_date = String(body.event_date ?? "").trim()
  const notes = String(body.notes ?? "").trim() || null
  let guests = null

  if (!title) errors.push("Event title is required")
  if (!SPACES.includes(space)) errors.push("Please choose a space")
  if (!ISO_DATE.test(event_date) || Number.isNaN(Date.parse(event_date))) {
    errors.push("Please choose a valid event date")
  }

  const rawGuests = String(body.guests ?? "").trim()
  if (rawGuests !== "") {
    const number = Number(rawGuests)
    if (!Number.isInteger(number) || number < 1) errors.push("Guests must be a whole number above 0")
    else guests = number
  }

  return { values: { title, space, event_date, guests, notes }, errors }
}

// List events, optionally between two dates: /api/events?from=2026-12-01&to=2026-12-31
router.get("/", async (req, res) => {
  const { from, to } = req.query

  if ((from && !ISO_DATE.test(from)) || (to && !ISO_DATE.test(to))) {
    return res.status(400).json({ error: "Dates must look like 2026-12-05" })
  }

  let query = supabase.from("events").select(FIELDS).order("event_date").order("space")
  if (from) query = query.gte("event_date", from)
  if (to) query = query.lte("event_date", to)

  const { data, error } = await query

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not load events" })
  }

  res.json(data)
})

// Create an event (by hand, or from an enquiry when it's booked)
router.post("/", async (req, res) => {
  const { values, errors } = validate(req.body)

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(". ") })
  }

  const enquiryId = req.body.enquiry_id ?? null

  if (enquiryId !== null) {
    const { data: enquiry, error } = await supabase
      .from("enquiries")
      .select("id")
      .eq("id", enquiryId)
      .maybeSingle()

    if (error) {
      console.error(error)
      return res.status(500).json({ error: "Could not check the enquiry" })
    }
    if (!enquiry) {
      return res.status(404).json({ error: "Enquiry not found" })
    }
  }

  // Double-booking check, with a friendly message
  const { data: clash, error: clashError } = await supabase
    .from("events")
    .select("title")
    .eq("space", values.space)
    .eq("event_date", values.event_date)
    .maybeSingle()

  if (clashError) {
    console.error(clashError)
    return res.status(500).json({ error: "Could not check availability" })
  }
  if (clash) {
    return res.status(409).json({
      error: `${values.space} is already booked on ${readableDate(values.event_date)} for "${clash.title}"`,
    })
  }

  const { data: event, error: insertError } = await supabase
    .from("events")
    .insert({ ...values, enquiry_id: enquiryId })
    .select(FIELDS)
    .single()

  // 23505 = the database's "unique" rule stopped a duplicate
  if (insertError?.code === "23505") {
    const message = insertError.message.includes("events_enquiry_unique")
      ? "This enquiry already has a booking"
      : `${values.space} is already booked on ${readableDate(values.event_date)}`
    return res.status(409).json({ error: message })
  }
  if (insertError) {
    console.error(insertError)
    return res.status(500).json({ error: "Could not save the event" })
  }

  if (enquiryId === null) {
    return res.status(201).json({ event, enquiry: null })
  }

  // Mark the enquiry as booked, with the confirmed details
  const changes = { status: "booked", space: values.space, event_date: values.event_date }
  if (values.guests !== null) changes.guests = values.guests

  const { data: enquiry, error: updateError } = await supabase
    .from("enquiries")
    .update(changes)
    .eq("id", enquiryId)
    .select(ENQUIRY_FIELDS)
    .single()

  if (updateError) {
    console.error(updateError)
    await supabase.from("events").delete().eq("id", event.id)
    return res.status(500).json({ error: "Could not mark the enquiry as booked" })
  }

  res.status(201).json({ event, enquiry })
})

// Delete an event (cancelled). A linked enquiry goes back to "contacted".
router.delete("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", req.params.id)
    .select("enquiry_id")

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not delete the event" })
  }
  if (data.length === 0) {
    return res.status(404).json({ error: "Event not found" })
  }

  const enquiryId = data[0].enquiry_id
  if (enquiryId) {
    const { error: revertError } = await supabase
      .from("enquiries")
      .update({ status: "contacted" })
      .eq("id", enquiryId)
      .eq("status", "booked")
    if (revertError) console.error(revertError)
  }

  res.status(204).end()
})

export default router