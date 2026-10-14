function SpaceCard({ name, bestFor, description, image }) {
  return (
    <article className="space-card">
      <img src={image} alt={name} />
      <div className="space-card-body">
        <h3>{name}</h3>
        <p className="space-subtitle">{bestFor}</p>
        <p>{description}</p>
        <a href="#gallery" className="outline-button">See Photos →</a>
      </div>
    </article>
  )
}

export default SpaceCard