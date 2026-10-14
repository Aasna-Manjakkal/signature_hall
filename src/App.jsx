import spaces from "./data/spaces"
import SpaceCard from "./components/SpaceCard"
import Gallery from "./components/Gallery"
import Contact from "./components/Contact"
import WhatsAppButton from "./components/WhatsAppButton"
import Navbar from "./components/Navbar"
function App() {
  return (
    <>
      <Navbar />
      <header className="hero" id="top">
      <div className="hero-content">
        <p className="eyebrow">Signature Hall</p>
        <h1>A Space for <span>Every Occasion</span></h1>
        <p className="hero-text">From intimate gatherings to grand celebrations in Kannur.</p>
        <a href="#spaces" className="button">Explore Our Spaces →</a>
        </div>
      </header>

      <main>
      <section className="section" id="spaces">
          <h2>Our Spaces</h2>
          <div className="spaces-grid">
            {spaces.map((space) => (
              <SpaceCard
                key={space.id}
                name={space.name}
                bestFor={space.bestFor}
                description={space.description}
              />
            ))}
          </div>
        </section>

        <Gallery />
        <Contact />
      </main>

      <WhatsAppButton />
    </>
  )
}

export default App