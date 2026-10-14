import spaces from "./data/spaces"
import SpaceCard from "./components/SpaceCard"
import Gallery from "./components/Gallery"
import WhatsAppButton from "./components/WhatsAppButton"
import Navbar from "./components/Navbar"
import Features from "./components/Features"
import WhyChoose from "./components/WhyChoose"
import CallToAction from "./components/CallToAction"
import Footer from "./components/Footer"

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
      <Features />

      <main>
      <section className="section" id="spaces">
        <div className="section-heading">
          <p className="eyebrow">Our Spaces</p>
          <h2>Two Beautiful Spaces, <span>Endless Possibilities</span></h2>
          <p>
            Whether it's an intimate meeting or a grand celebration, Signature Hall offers
            spaces that can be arranged just the way you envision.
           </p>
        </div>

        <div className="spaces-grid">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              name={space.name}
              bestFor={space.bestFor}
              description={space.description}
              image={space.image}
            />
         ))}
        </div>
      </section>

      <Gallery />
      <WhyChoose />
      <CallToAction />
      </main>
      <Footer />

      <WhatsAppButton />
    </>
  )
}

export default App