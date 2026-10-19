import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import ScrollToTop from "./ScrollToTop"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { trackPageView, trackLinkClick } from "../lib/track"

function Layout() {
    const { pathname } = useLocation()

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  useEffect(() => {
    function handleClick(event) {
      const link = event.target.closest("a")
      if (link) trackLinkClick(link)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])
  
  return (
    <div className="layout">
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout