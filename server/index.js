import express from "express"
import cors from "cors"
import galleryRoutes from "./routes/gallery.js"
import adminRoutes from "./routes/admin.js"

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }))
app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() })
})

app.use("/api/gallery", galleryRoutes)
app.use("/api/admin", adminRoutes)

app.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Photos must be 5 MB or smaller" })
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message })
  }

  console.error(err)
  res.status(500).json({ error: "Something went wrong on the server" })
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})