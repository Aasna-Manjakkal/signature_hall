import { Router } from "express"
import supabase from "../supabase.js"

const router = Router()

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id, image_url, category, alt, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not load gallery photos" })
  }

  res.json(data)
})

export default router