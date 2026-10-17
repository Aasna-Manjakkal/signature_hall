import supabase from "../supabase.js"

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: "Please log in" })
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: "Your session has expired. Please log in again." })
  }

  const email = data.user.email?.toLowerCase()

  if (!adminEmails.includes(email)) {
    return res.status(403).json({ error: "This account does not have admin access" })
  }

  req.user = data.user
  next()
}

export default requireAdmin