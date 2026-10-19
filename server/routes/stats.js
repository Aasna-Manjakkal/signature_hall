import { Router } from "express"
import supabase from "../supabase.js"
import requireAdmin from "../middleware/requireAdmin.js"

const router = Router()

router.get("/", requireAdmin, async (req, res) => {
  const days = Number(req.query.days ?? 30)

  if (![7, 30, 90].includes(days)) {
    return res.status(400).json({ error: "Days must be 7, 30 or 90" })
  }

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase.rpc("visitor_stats", { since })

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not load statistics" })
  }

  res.json(data)
})

export default router