import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

function RequireAdmin({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="admin-loading">Loading…</p>
  if (!session) return <Navigate to="/admin/login" replace />

  return children
}

export default RequireAdmin