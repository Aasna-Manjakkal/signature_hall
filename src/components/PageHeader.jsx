import { Link } from "react-router-dom"

function PageHeader({ eyebrow, title, image, crumb }) {
  return (
    <header
      className="page-header"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(28, 14, 6, 0.88) 0%, rgba(28, 14, 6, 0.65) 28%, rgba(28, 14, 6, 0.2) 52%, rgba(28, 14, 6, 0) 68%), linear-gradient(0deg, rgba(28, 14, 6, 0.45) 0%, rgba(28, 14, 6, 0) 35%), url(${image})`,
      }}>
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