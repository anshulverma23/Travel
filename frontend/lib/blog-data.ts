export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string[]
  author: string
  date: string
  image: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-time-to-visit-india",
    title: "The Best Time to Visit India: A Season-by-Season Guide",
    excerpt: "India's climate varies dramatically by region. Here's how to time your trip to any corner of the country.",
    author: "Team India Travel",
    date: "2026-01-12",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600&auto=format&fit=crop",
    tags: ["Travel Tips", "Planning"],
    content: [
      "India spans deserts, coastlines, tropical backwaters and Himalayan peaks - so 'the best time to visit' really depends on where you're headed.",
      "For North India and the Golden Triangle (Delhi, Agra, Jaipur), October through March offers cool, dry weather that's ideal for sightseeing.",
      "Kerala's backwaters are pleasant nearly year-round, though the shoulder season of September to March avoids both peak monsoon and peak heat.",
      "If the Himalayas are calling, plan for April to June or September to November, when mountain passes are clear and trekking trails are open.",
      "Whatever your route, our destination pages show live weather and a recommended best-time-to-visit window, so you can plan with confidence.",
    ],
  },
  {
    slug: "golden-triangle-itinerary",
    title: "7 Days on the Golden Triangle: A Sample Itinerary",
    excerpt: "Delhi, Agra, and Jaipur pack centuries of history into a compact, unforgettable week.",
    author: "Team India Travel",
    date: "2025-12-02",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600&auto=format&fit=crop",
    tags: ["Itineraries", "Rajasthan"],
    content: [
      "The Golden Triangle - Delhi, Agra, and Jaipur - is the classic first trip to India, and for good reason.",
      "Days 1-2: Explore Old and New Delhi, from the Red Fort and Jama Masjid to India Gate and Humayun's Tomb.",
      "Day 3: Drive to Agra and watch the sunrise over the Taj Mahal, followed by Agra Fort in the afternoon.",
      "Days 4-6: Continue to Jaipur, the Pink City, for Amber Fort, City Palace, and the bustling bazaars of the old town.",
      "Day 7: Fly home from Jaipur or add on a few days in Ranthambore National Park for a tiger safari.",
      "Browse our curated Golden Triangle package for a version of this trip with hotels and transport already arranged.",
    ],
  },
  {
    slug: "kerala-backwaters-guide",
    title: "A First-Timer's Guide to the Kerala Backwaters",
    excerpt: "Houseboats, coconut groves, and some of the calmest travel days you'll ever have.",
    author: "Team India Travel",
    date: "2025-11-18",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop",
    tags: ["Kerala", "Nature"],
    content: [
      "The backwaters of Kerala are a network of lagoons, lakes, and canals that run parallel to the Arabian Sea coast.",
      "Most visitors base themselves in Alleppey or Kumarakom, both well-connected to Kochi's international airport.",
      "An overnight houseboat cruise is the highlight for most travelers - meals are cooked on board, and the pace is unhurried.",
      "Beyond the water, don't miss a spice plantation tour or an Ayurvedic massage, both regional specialties.",
      "Check our Kerala hotels and packages for houseboats and backwater resorts we've personally vetted.",
    ],
  },
]

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug)
}
