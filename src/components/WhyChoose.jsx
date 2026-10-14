import { Gem, Users, MapPin, Settings } from "lucide-react"

const reasons = [
  { icon: Gem, title: "Beautiful Interiors", text: "Modern and elegant setup" },
  { icon: Users, title: "Suitable for All Events", text: "From meetings to weddings" },
  { icon: MapPin, title: "Convenient Location", text: "Easily accessible in Kannur" },
  { icon: Settings, title: "Customisable Arrangements", text: "Open or covered, as you need" },
]

function WhyChoose() {
  return (
    <section className="why-choose">
      <p className="eyebrow">Why Choose Signature Hall</p>
      <div className="why-grid">
        {reasons.map((reason) => {
          const Icon = reason.icon
          return (
            <div className="why-item" key={reason.title}>
              <Icon className="why-icon" size={34} strokeWidth={1.5} />
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default WhyChoose