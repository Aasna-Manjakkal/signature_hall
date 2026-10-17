import { supabase } from "./supabase"

const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.error || `Request failed (${response.status})`)
  }

  return result
}