function SpaceCard({ name, bestFor, description }) {
    return (
      <article className="space-card">
        <h3>{name}</h3>
        <p><strong>Best for:</strong> {bestFor}</p>
        <p>{description}</p>
      </article>
    )
  }
  
  export default SpaceCard