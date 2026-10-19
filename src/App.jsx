import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import SpacesPage from "./pages/SpacesPage"
import GalleryPage from "./pages/GalleryPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import { AuthProvider } from "./admin/AuthContext"
import RequireAdmin from "./admin/RequireAdmin"
import AdminLogin from "./admin/AdminLogin"
import AdminLayout from "./admin/AdminLayout"
import AdminHome from "./admin/AdminHome"
import AdminGallery from "./admin/AdminGallery"
import AdminEnquiries from "./admin/AdminEnquiries"
import AdminEvents from "./admin/AdminEvents"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="calendar" element={<AdminEvents />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App