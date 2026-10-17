import { NavLink, Outlet, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "./AuthContext"

function AdminLayout() {
  const { session } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-brand">Signature Hall</p>
        <nav>
          <NavLink to="/admin" end>Dashboard</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <p className="admin-muted">{session?.user.email}</p>
          <Link to="/">View website</Link>
          <button onClick={() => supabase.auth.signOut()}>Log out</button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout