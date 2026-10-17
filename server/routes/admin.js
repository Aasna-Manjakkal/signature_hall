import { Router } from "express"
import requireAdmin from "../middleware/requireAdmin.js"

const router = Router()

router.get("/me", requireAdmin, (req, res) => {
  res.json({ email: req.user.email })
})

export default router