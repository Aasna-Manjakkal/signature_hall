function SpaceCard({ name, bestFor, description }) {
    return (
      <article>
        <h3>{name}</h3>
        <p><strong>Best for:</strong> {bestFor}</p>
        <p>{description}</p>
      </article>
    )
  }
  
  export default SpaceCard