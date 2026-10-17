import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "./AuthContext"

function AdminLogin() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)
    if (error) {
      setError("Email or password is incorrect.")
      return
    }
    navigate("/admin")
  }

  return (
    <div className="admin-login">
      <form className="admin-card" onSubmit={handleSubmit}>
        <h1>Signature Hall Admin</h1>
        <p className="admin-muted">Log in to manage the gallery, enquiries and events.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" className="button" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin