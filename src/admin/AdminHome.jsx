import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api"

function AdminHome() {
  const [message, setMessage] = useState("Checking connection to the API…")

  useEffect(() => {
    apiFetch("/api/admin/me")
      .then((data) => setMessage(`The API confirms you are logged in as ${data.email}.`))
      .catch((err) => setMessage(`API error: ${err.message}`))
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="admin-card">
        <p>{message}</p>
      </div>
    </div>
  )
}

export default AdminHome