import { Building2, Settings, Tent, MapPin, PartyPopper, MessageCircle } from "lucide-react"

const reasons = [
  {
    icon: Building2,
    title: "Two Spaces, One Venue",
    text: "An upper floor for small functions and meetings, and a ground floor for weddings and receptions.",
  },
  {
    icon: Settings,
    title: "Arranged Your Way",
    text: "Seating, stage, décor and timing are planned around what you want, not a fixed package.",
  },
  {
    icon: Tent,
    title: "Open or Covered",
    text: "The ground floor can be set up open-air or covered, depending on the event and the season.",
  },
  {
    icon: MapPin,
    title: "Easy to Reach",
    text: "Located at Palliyamoola Junction, Kannur, convenient for guests from across the district.",
  },
  {
    icon: PartyPopper,
    title: "For Every Occasion",
    text: "Weddings, receptions, engagements, birthdays, family functions and business meetings.",
  },
  {
    icon: MessageCircle,
    title: "Quick to Enquire",
    text: "Message us on WhatsApp to check dates, ask questions or arrange a visit to see the spaces.",
  },
]

function WhyChoose() {
  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Why Choose Us</p>
        <h2>Why Choose <span>Signature Hall</span></h2>
      </div>

      <div className="reason-grid">
        {reasons.map((reason) => {
          const Icon = reason.icon
          return (
            <div className="reason-card" key={reason.title}>
              <div className="reason-icon">
                <Icon size={28} strokeWidth={1.6} />
              </div>
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