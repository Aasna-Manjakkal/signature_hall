import { Users, Presentation, Armchair, Tent, Sparkles } from "lucide-react"

const spaces = [
  {
    id: 1,
    name: "Upper Floor",
    bestFor: "Intimate Gatherings & Meetings",
    description: "Ideal for small functions, family gatherings, meetings, workshops and private events.",
    details:
      "A quieter space on the upper floor for functions where the guest list is smaller. It suits family celebrations, engagements and birthdays as well as business meetings and workshops, with seating arranged to your plan.",
    image: "/gallery/upper-1.jpg",
    highlights: [
      { icon: Users, label: "Ideal for small groups" },
      { icon: Presentation, label: "Suitable for meetings & workshops" },
      { icon: Armchair, label: "Seating arranged to your plan" },
    ],
  },
  {
    id: 2,
    name: "Ground Floor",
    bestFor: "Weddings, Receptions & Celebrations",
    description: "Spacious and versatile for weddings, receptions and large gatherings. Can be arranged as open or covered, as you prefer.",
    details:
      "The larger space for the days when the whole family, the neighbours and friends all come. It hosts weddings, receptions and big family functions, and can be set up open-air or covered, with the stage and décor planned around what you want.",
    image: "/gallery/hero.jpg",
    highlights: [
      { icon: Users, label: "Suitable for large gatherings" },
      { icon: Tent, label: "Open or covered arrangements" },
      { icon: Sparkles, label: "Customisable décor setup" },
    ],
  },
]

export default spaces