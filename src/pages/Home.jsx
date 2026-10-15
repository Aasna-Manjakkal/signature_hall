import { Link } from "react-router-dom"
import spaces from "../data/spaces"
import SpaceCard from "../components/SpaceCard"
import Features from "../components/Features"
import Gallery from "../components/Gallery"
import WhyChoose from "../components/WhyChoose"

function Home() {
  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">Banquet Hall · Kannur, Kerala</p>
          <h1>Signature Hall</h1>
          <p className="hero-tagline">A Space for <span>Every Occasion</span></p>
          <p className="hero-text">From intimate gatherings to grand celebrations in Kannur.</p>
          <Link to="/spaces" className="button">Explore Our Spaces →</Link>
        </div>
      </header>

      <Features />

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

      <Gallery limit={6} />
      <WhyChoose />
    </>
  )
}

export default Home