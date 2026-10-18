import { Router } from "express"
import multer from "multer"
import { randomUUID } from "node:crypto"
import supabase from "../supabase.js"
import requireAdmin from "../middleware/requireAdmin.js"

const router = Router()

const BUCKET = "gallery"
const CATEGORIES = ["Weddings", "Receptions", "Meetings", "Decorations"]
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}
const PUBLIC_COLUMNS = "id, image_url, category, alt, sort_order"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (ALLOWED_TYPES[file.mimetype]) {
      callback(null, true)
    } else {
      const error = new Error("Only JPG, PNG or WebP images are allowed")
      error.status = 400
      callback(error)
    }
  },
})

// Anyone: list photos
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select(PUBLIC_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not load gallery photos" })
  }

  res.json(data)
})

// Admin: upload a photo
router.post("/", requireAdmin, upload.single("photo"), async (req, res) => {
  const { category, alt } = req.body
  const sortOrder = Number(req.body.sort_order) || 0

  if (!req.file) {
    return res.status(400).json({ error: "Please choose a photo to upload" })
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Please choose a valid category" })
  }
  if (!alt || !alt.trim()) {
    return res.status(400).json({ error: "Please add a short description of the photo" })
  }

  const path = `${randomUUID()}.${ALLOWED_TYPES[req.file.mimetype]}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, req.file.buffer, {
      contentType: req.file.mimetype,
      cacheControl: "31536000",
    })

  if (uploadError) {
    console.error(uploadError)
    return res.status(500).json({ error: "Could not upload the photo" })
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)

  const { data, error } = await supabase
    .from("gallery_photos")
    .insert({
      image_url: urlData.publicUrl,
      storage_path: path,
      category,
      alt: alt.trim(),
      sort_order: sortOrder,
    })
    .select(PUBLIC_COLUMNS)
    .single()

  if (error) {
    console.error(error)
    await supabase.storage.from(BUCKET).remove([path])
    return res.status(500).json({ error: "Could not save the photo details" })
  }

  res.status(201).json(data)
})

// Admin: edit category, description or order
router.patch("/:id", requireAdmin, async (req, res) => {
  const { category, alt, sort_order } = req.body
  const updates = {}

  if (category !== undefined) {
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Please choose a valid category" })
    }
    updates.category = category
  }

  if (alt !== undefined) {
    if (!String(alt).trim()) {
      return res.status(400).json({ error: "The description can't be empty" })
    }
    updates.alt = String(alt).trim()
  }

  if (sort_order !== undefined) {
    const order = Number(sort_order)
    if (!Number.isInteger(order)) {
      return res.status(400).json({ error: "Order must be a whole number" })
    }
    updates.sort_order = order
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Nothing to update" })
  }

  const { data, error } = await supabase
    .from("gallery_photos")
    .update(updates)
    .eq("id", req.params.id)
    .select(PUBLIC_COLUMNS)
    .single()

  if (error?.code === "PGRST116") {
    return res.status(404).json({ error: "Photo not found" })
  }
  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not update the photo" })
  }

  res.json(data)
})

// Admin: delete a photo
router.delete("/:id", requireAdmin, async (req, res) => {
  const { data: photo, error: findError } = await supabase
    .from("gallery_photos")
    .select("storage_path")
    .eq("id", req.params.id)
    .single()

  if (findError) {
    return res.status(404).json({ error: "Photo not found" })
  }

  const { error } = await supabase
    .from("gallery_photos")
    .delete()
    .eq("id", req.params.id)

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not delete the photo" })
  }

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([photo.storage_path])

  if (storageError) {
    console.error("Photo row deleted but file left in storage:", photo.storage_path, storageError)
  }

  res.status(204).end()
})

export default router