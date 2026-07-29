export interface Destination {
  id: string
  name: string
  tagline: string
  description: string
  longDescription: string
  image: string
  gallery: string[]
  highlights: string[]
  bestTimeToVisit: string
  popularAttractions: {
    name: string
    description: string
    image: string
  }[]
  experiences: string[]
  climate: string
  languages: string[]
  currency: string
  timeZone: string
  relatedTours: string[]
}

export const destinations: Destination[] = [
  {
    id: "rajasthan",
    name: "Rajasthan",
    tagline: "Land of Kings",
    description: "Experience the royal heritage, majestic forts, and vibrant culture of India's most colorful state.",
    longDescription: "Rajasthan, the Land of Kings, is India's largest state and one of its most popular tourist destinations. This desert state is home to magnificent palaces, imposing forts, vibrant bazaars, and a rich cultural heritage that spans centuries. From the pink city of Jaipur to the blue city of Jodhpur, from the romantic lakes of Udaipur to the golden sands of Jaisalmer, Rajasthan offers an unforgettable journey through India's royal past. The state's colorful festivals, traditional arts, delicious cuisine, and warm hospitality make it a must-visit destination for travelers seeking an authentic Indian experience.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2127&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2127&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586612438666-ffd5efa04fd5?q=80&w=2074&auto=format&fit=crop"
    ],
    highlights: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar", "Ranthambore"],
    bestTimeToVisit: "October to March",
    popularAttractions: [
      {
        name: "Amber Fort",
        description: "A stunning hilltop fortress showcasing Rajput architecture with breathtaking views of Maota Lake.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2127&auto=format&fit=crop"
      },
      {
        name: "City Palace Udaipur",
        description: "A magnificent lakeside palace complex featuring intricate architecture and royal artifacts.",
        image: "https://images.unsplash.com/photo-1586612438666-ffd5efa04fd5?q=80&w=2074&auto=format&fit=crop"
      },
      {
        name: "Mehrangarh Fort",
        description: "One of India's largest forts, perched on a rocky cliff overlooking the blue city of Jodhpur.",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    experiences: [
      "Camel safari in the Thar Desert",
      "Heritage stay in royal palaces",
      "Traditional Rajasthani cuisine tasting",
      "Folk music and dance performances",
      "Tiger safari at Ranthambore",
      "Hot air balloon ride over Jaipur"
    ],
    climate: "Semi-arid with hot summers and cool winters",
    languages: ["Hindi", "Rajasthani", "English"],
    currency: "Indian Rupee (INR)",
    timeZone: "IST (UTC+5:30)",
    relatedTours: ["golden-triangle", "royal-rajasthan"]
  },
  {
    id: "kerala",
    name: "Kerala",
    tagline: "God's Own Country",
    description: "Discover serene backwaters, lush tea plantations, and ancient Ayurvedic traditions in this tropical paradise.",
    longDescription: "Kerala, often called 'God's Own Country,' is a tropical paradise nestled between the Arabian Sea and the Western Ghats. This enchanting state is famous for its palm-fringed backwaters, pristine beaches, misty hill stations covered in tea and spice plantations, and rich cultural heritage. Kerala is also the birthplace of Ayurveda, the ancient Indian system of medicine, and offers world-class wellness retreats. The state's unique culture, influenced by Hindu, Christian, and Muslim traditions, is reflected in its festivals, cuisine, and art forms like Kathakali and Theyyam.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2132&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2132&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609340853288-99037722e8a5?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585116938581-2edcff0d1d7c?q=80&w=2070&auto=format&fit=crop"
    ],
    highlights: ["Alleppey Backwaters", "Munnar", "Kochi", "Thekkady", "Kovalam", "Wayanad"],
    bestTimeToVisit: "September to March",
    popularAttractions: [
      {
        name: "Alleppey Backwaters",
        description: "A network of serene lagoons, lakes, and canals perfect for houseboat cruises.",
        image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=2069&auto=format&fit=crop"
      },
      {
        name: "Munnar Tea Gardens",
        description: "Rolling hills covered in emerald-green tea plantations at elevations over 1,500 meters.",
        image: "https://images.unsplash.com/photo-1609340853288-99037722e8a5?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Fort Kochi",
        description: "A historic port town with colonial architecture, Chinese fishing nets, and vibrant art scene.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2132&auto=format&fit=crop"
      }
    ],
    experiences: [
      "Houseboat cruise through backwaters",
      "Ayurvedic spa and wellness retreat",
      "Tea plantation tour and tasting",
      "Kathakali dance performance",
      "Spice garden walk",
      "Beach yoga at sunrise"
    ],
    climate: "Tropical with monsoons from June to September",
    languages: ["Malayalam", "English", "Hindi"],
    currency: "Indian Rupee (INR)",
    timeZone: "IST (UTC+5:30)",
    relatedTours: ["kerala-backwaters"]
  },
  {
    id: "himalayas",
    name: "Himalayas",
    tagline: "Roof of the World",
    description: "Trek through breathtaking mountain passes, visit ancient monasteries, and experience Tibetan culture.",
    longDescription: "The Indian Himalayas offer some of the most spectacular mountain landscapes on Earth. From the stark, otherworldly beauty of Ladakh to the lush valleys of Himachal Pradesh and the spiritual atmosphere of Uttarakhand, this region captivates travelers with its dramatic scenery, ancient Buddhist monasteries, and adventure opportunities. Whether you seek challenging treks, peaceful meditation retreats, or simply want to witness the majesty of the world's highest peaks, the Himalayas provide an unforgettable experience that touches the soul.",
    image: "https://images.unsplash.com/photo-1585116938581-2edcff0d1d7c?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1585116938581-2edcff0d1d7c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?q=80&w=2070&auto=format&fit=crop"
    ],
    highlights: ["Ladakh", "Manali", "Rishikesh", "Dharamsala", "Spiti Valley", "Valley of Flowers"],
    bestTimeToVisit: "May to October (varies by region)",
    popularAttractions: [
      {
        name: "Pangong Lake",
        description: "A stunning high-altitude lake with crystal-clear blue waters stretching across India and Tibet.",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Rohtang Pass",
        description: "A high mountain pass offering panoramic views of snow-capped peaks and glaciers.",
        image: "https://images.unsplash.com/photo-1585116938581-2edcff0d1d7c?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Rishikesh Ashrams",
        description: "The yoga capital of the world, where the Ganges flows through a valley of spiritual retreats.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2074&auto=format&fit=crop"
      }
    ],
    experiences: [
      "High-altitude trekking adventures",
      "Monastery visits and meditation",
      "White water rafting in Rishikesh",
      "Mountain biking through valleys",
      "Yoga and spiritual retreats",
      "Camping under starlit skies"
    ],
    climate: "Alpine, with cold winters and mild summers at high altitudes",
    languages: ["Hindi", "Ladakhi", "Tibetan", "English"],
    currency: "Indian Rupee (INR)",
    timeZone: "IST (UTC+5:30)",
    relatedTours: ["himalayan-adventure"]
  },
  {
    id: "varanasi",
    name: "Varanasi",
    tagline: "The Spiritual Heart",
    description: "Witness ancient rituals on the sacred Ganges and explore one of the world's oldest continuously inhabited cities.",
    longDescription: "Varanasi, also known as Kashi or Benares, is one of the world's oldest continuously inhabited cities and the spiritual capital of India. Situated on the banks of the sacred Ganges River, this holy city has been a center of learning, culture, and spirituality for over 3,000 years. The atmospheric ghats, where pilgrims perform ritual ablutions and cremations take place, the narrow winding lanes filled with ancient temples, and the mesmerizing Ganga Aarti ceremony at dusk create an experience unlike anywhere else on Earth. Varanasi is where many Hindus come to attain moksha (liberation from the cycle of rebirth).",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2076&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2076&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570804485046-5aaafb5c6e98?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587922546307-776227941871?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609947017136-9dfe24fdef40?q=80&w=2070&auto=format&fit=crop"
    ],
    highlights: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath", "Manikarnika Ghat", "Assi Ghat", "Ramnagar Fort"],
    bestTimeToVisit: "October to March",
    popularAttractions: [
      {
        name: "Dashashwamedh Ghat",
        description: "The main ghat where the spectacular Ganga Aarti ceremony is performed every evening.",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2076&auto=format&fit=crop"
      },
      {
        name: "Sarnath",
        description: "The sacred Buddhist site where Buddha delivered his first sermon after enlightenment.",
        image: "https://images.unsplash.com/photo-1587922546307-776227941871?q=80&w=2074&auto=format&fit=crop"
      },
      {
        name: "Kashi Vishwanath Temple",
        description: "One of the most famous Hindu temples dedicated to Lord Shiva, a major pilgrimage site.",
        image: "https://images.unsplash.com/photo-1570804485046-5aaafb5c6e98?q=80&w=2070&auto=format&fit=crop"
      }
    ],
    experiences: [
      "Sunrise boat ride on the Ganges",
      "Witness the Ganga Aarti ceremony",
      "Walk through ancient temple lanes",
      "Classical music and dance performances",
      "Silk weaving workshops",
      "Buddhist pilgrimage to Sarnath"
    ],
    climate: "Humid subtropical with hot summers and cool winters",
    languages: ["Hindi", "Bhojpuri", "English"],
    currency: "Indian Rupee (INR)",
    timeZone: "IST (UTC+5:30)",
    relatedTours: ["golden-triangle"]
  }
]

export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id)
}

export function getAllDestinationIds(): string[] {
  return destinations.map((d) => d.id)
}
