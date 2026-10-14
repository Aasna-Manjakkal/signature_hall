import { Users, Settings, Flower2, MapPin } from "lucide-react"

const features = [
  { icon: Users, title: "Flexible Spaces", text: "For small and large events" },
  { icon: Settings, title: "Customisable Setup", text: "As per your requirements" },
  { icon: Flower2, title: "Elegant Ambience", text: "Beautiful and well maintained" },
  { icon: MapPin, title: "Prime Location", text: "In Kannur, Kerala" },
]

function Features() {
  return (
    <div className="features">
      {features.map((feature) => {
        const Icon = feature.icon
        return (
          <div className="feature" key={feature.title}>
            <Icon className="feature-icon" size={32} strokeWidth={1.5} />
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Features