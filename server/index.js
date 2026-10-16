import express from "express"
import cors from "cors"
import galleryRoutes from "./routes/gallery.js"

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }))
app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() })
})

app.use("/api/gallery", galleryRoutes)

app.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})