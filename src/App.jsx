import spaces from "./data/spaces"
import SpaceCard from "./components/SpaceCard"

function App() {
  return (
    <main>
      <h1>Signature Hall</h1>
      <p>A banquet hall in Kannur, Kerala</p>

      <section>
        <h2>Our Spaces</h2>
        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            name={space.name}
            bestFor={space.bestFor}
            description={space.description}
          />
        ))}
      </section>
    </main>
  )
}

export default App