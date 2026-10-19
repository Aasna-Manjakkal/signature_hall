import { Settings, Sparkles, HandHeart, MapPin } from "lucide-react"
import PageHeader from "../components/PageHeader"
import WhyChoose from "../components/WhyChoose"

const points = [
  { icon: Settings, text: "Flexible arrangements for different events" },
  { icon: Sparkles, text: "Well-maintained and elegant spaces" },
  { icon: HandHeart, text: "Personalised setup as per your requirements" },
  { icon: MapPin, text: "Conveniently located at Palliyamoola Junction, Kannur" },
]

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Your Special Moments, Our Special Place"
        image="/gallery/DSC09732.JPG"
        crumb="About Us"
      />

      <section className="section about-grid">
        <img src="/gallery/entrance.png" alt="Entrance of Signature Hall, Kannur" />

        <div>
          <h2 className="title-line">Our Story</h2>

          {/* Replace these paragraphs with the hall's real story */}
          <p>
            Signature Hall is an event venue in Kannur, built for the moments families and
            businesses want to get right. The upper floor hosts smaller functions and meetings,
            and the ground floor is home to weddings, receptions and large celebrations.
          </p>
          <p>
            Every event here is arranged around the people hosting it. Seating, stage, décor and
            timing are planned with you, so the hall feels like your celebration rather than a
            fixed package.
          </p>

          <ul className="about-points">
            {points.map((point) => {
              const Icon = point.icon
              return (
                <li key={point.text}>
                  <Icon size={22} strokeWidth={1.6} />
                  <span>{point.text}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <WhyChoose />
    </>
  )
}

export default AboutPage