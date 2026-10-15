import { Link } from "react-router-dom"

function PageHeader({ eyebrow, title, image, crumb }) {
  return (
    <header
      className="page-header"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${image})` }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>{crumb}</span>
      </nav>
    </header>
  )
}

export default PageHeader