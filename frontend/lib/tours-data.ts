export interface Tour {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  gallery: string[]
  duration: string
  groupSize: string
  rating: number
  reviewCount: number
  price: number
  originalPrice?: number
  tag: string
  difficulty: "Easy" | "Moderate" | "Challenging"
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: {
    day: number
    title: string
    description: string
    meals: string[]
    accommodation?: string
  }[]
}

export const tours: Tour[] = [
  {
    id: "golden-triangle-classic",
    title: "Golden Triangle Classic",
    description:
      "Delhi, Agra & Jaipur - The perfect introduction to India's rich heritage and the iconic Taj Mahal.",
    longDescription:
      "Embark on India's most iconic journey through the Golden Triangle, connecting Delhi, Agra, and Jaipur. This carefully curated tour takes you through centuries of history, from the Mughal magnificence of the Taj Mahal to the pink-hued palaces of Jaipur. Experience the perfect blend of ancient traditions and modern India, with expert guides bringing every monument to life.",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=2071&auto=format&fit=crop",
    ],
    duration: "7 Days",
    groupSize: "Max 12",
    rating: 4.9,
    reviewCount: 248,
    price: 1299,
    originalPrice: 1599,
    tag: "Best Seller",
    difficulty: "Easy",
    highlights: [
      "Sunrise visit to the Taj Mahal",
      "Explore the majestic Amber Fort",
      "Walk through Old Delhi's vibrant bazaars",
      "Traditional Rajasthani dinner with folk performances",
      "Visit UNESCO World Heritage Sites",
      "Rickshaw ride through Chandni Chowk",
    ],
    inclusions: [
      "6 nights accommodation in 4-star heritage hotels",
      "Daily breakfast and 3 dinners",
      "All transfers in air-conditioned vehicles",
      "English-speaking expert guide",
      "All monument entrance fees",
      "Rickshaw ride in Old Delhi",
      "Airport transfers",
      "24/7 on-trip support",
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips and gratuities",
      "Meals not mentioned",
      "Camera fees at monuments",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Delhi",
        description:
          "Welcome to India! Upon arrival at Delhi International Airport, our representative will greet you and transfer you to your hotel. Rest and refresh before an evening orientation walk around Connaught Place.",
        meals: ["Dinner"],
        accommodation: "The Imperial, New Delhi",
      },
      {
        day: 2,
        title: "Discover Old & New Delhi",
        description:
          "Explore the contrasts of Delhi - from the historic Red Fort and Jama Masjid to the grand India Gate and Humayun's Tomb. Experience a rickshaw ride through the bustling lanes of Chandni Chowk.",
        meals: ["Breakfast"],
        accommodation: "The Imperial, New Delhi",
      },
      {
        day: 3,
        title: "Delhi to Agra",
        description:
          "Drive to Agra, stopping at Sikandra to see Akbar's Tomb. In Agra, visit the magnificent Agra Fort. Evening at leisure to explore local markets or relax at your hotel.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "ITC Mughal, Agra",
      },
      {
        day: 4,
        title: "Taj Mahal Sunrise & Jaipur",
        description:
          "Wake early for the magical sunrise at the Taj Mahal. After breakfast, drive to Jaipur via Fatehpur Sikri, the abandoned Mughal city. Arrive in Jaipur by evening.",
        meals: ["Breakfast"],
        accommodation: "Rambagh Palace, Jaipur",
      },
      {
        day: 5,
        title: "Royal Jaipur",
        description:
          "Full day exploring the Pink City. Visit Amber Fort with an elephant ride, City Palace, Jantar Mantar observatory, and photo stop at Hawa Mahal. Evening traditional dinner with folk performances.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Rambagh Palace, Jaipur",
      },
      {
        day: 6,
        title: "Jaipur at Leisure",
        description:
          "Morning free for shopping in Jaipur's famous bazaars for textiles, jewelry, and handicrafts. Optional cooking class or spa treatment. Afternoon city walk through local neighborhoods.",
        meals: ["Breakfast"],
        accommodation: "Rambagh Palace, Jaipur",
      },
      {
        day: 7,
        title: "Departure",
        description:
          "Transfer to Jaipur Airport or continue your journey. Alternatively, return to Delhi for your onward flight. Bid farewell to incredible India with unforgettable memories.",
        meals: ["Breakfast"],
      },
    ],
  },
  {
    id: "kerala-backwater-bliss",
    title: "Kerala Backwater Bliss",
    description:
      "Cruise through serene backwaters, explore spice plantations, and rejuvenate with Ayurvedic treatments.",
    longDescription:
      "Discover God's Own Country on this immersive journey through Kerala. From the misty tea gardens of Munnar to the tranquil backwaters of Alleppey, experience the unique culture, cuisine, and natural beauty that makes Kerala one of the world's most sought-after destinations. Includes authentic Ayurvedic experiences and a night on a traditional houseboat.",
    image:
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=2069&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2069&auto=format&fit=crop",
    ],
    duration: "10 Days",
    groupSize: "Max 10",
    rating: 4.8,
    reviewCount: 186,
    price: 1899,
    originalPrice: 2299,
    tag: "Wellness",
    difficulty: "Easy",
    highlights: [
      "Overnight stay on a traditional Kerala houseboat",
      "Tea plantation visit in Munnar",
      "Authentic Ayurvedic massage and treatments",
      "Spice garden tour with cooking class",
      "Kathakali dance performance",
      "Wildlife safari in Periyar National Park",
    ],
    inclusions: [
      "9 nights accommodation including houseboat",
      "All meals on houseboat, breakfast elsewhere",
      "Ayurvedic massage session",
      "All transfers in air-conditioned vehicles",
      "English-speaking guide",
      "Periyar boat safari",
      "Cooking class with local family",
      "Airport transfers",
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Tips and gratuities",
      "Optional activities",
      "Meals not mentioned",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kochi",
        description:
          "Arrive at Cochin International Airport. Transfer to your heritage hotel in Fort Kochi. Evening walking tour of this historic port town with its Chinese fishing nets and colonial architecture.",
        meals: ["Dinner"],
        accommodation: "Brunton Boatyard, Kochi",
      },
      {
        day: 2,
        title: "Exploring Kochi",
        description:
          "Full day exploring Fort Kochi - visit the Jewish Synagogue, Dutch Palace, and St. Francis Church. Evening Kathakali dance performance showcasing Kerala's classical art form.",
        meals: ["Breakfast"],
        accommodation: "Brunton Boatyard, Kochi",
      },
      {
        day: 3,
        title: "Kochi to Munnar",
        description:
          "Scenic drive to Munnar through winding mountain roads. Stop at waterfalls and viewpoints. Arrive at your resort nestled among tea plantations.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Windermere Estate, Munnar",
      },
      {
        day: 4,
        title: "Tea Gardens of Munnar",
        description:
          "Visit a working tea factory and learn the art of tea production. Trek through the tea gardens. Afternoon visit to Eravikulam National Park to spot the endangered Nilgiri Tahr.",
        meals: ["Breakfast"],
        accommodation: "Windermere Estate, Munnar",
      },
      {
        day: 5,
        title: "Munnar to Thekkady",
        description:
          "Drive to Thekkady, gateway to Periyar Wildlife Sanctuary. Visit a spice plantation and learn about cardamom, pepper, and vanilla cultivation. Cooking class with local family.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Spice Village, Thekkady",
      },
      {
        day: 6,
        title: "Periyar Wildlife",
        description:
          "Morning boat safari on Periyar Lake, spotting elephants and exotic birds. Afternoon at leisure for optional activities - nature walks, bamboo rafting, or tribal village visit.",
        meals: ["Breakfast"],
        accommodation: "Spice Village, Thekkady",
      },
      {
        day: 7,
        title: "Thekkady to Alleppey",
        description:
          "Drive down to the backwaters. Board your traditional Kerala houseboat and begin your cruise through the palm-fringed waterways. Fresh seafood lunch and dinner onboard.",
        meals: ["Breakfast", "Lunch", "Dinner"],
        accommodation: "Premium Houseboat",
      },
      {
        day: 8,
        title: "Backwaters to Kumarakom",
        description:
          "Continue cruising through the backwaters, observing village life along the canals. Disembark and transfer to your lakeside Ayurvedic resort.",
        meals: ["Breakfast"],
        accommodation: "Kumarakom Lake Resort",
      },
      {
        day: 9,
        title: "Ayurvedic Retreat",
        description:
          "Day dedicated to wellness and relaxation. Enjoy a full Ayurvedic massage and treatment session. Yoga by the lake. Free time to explore the resort's grounds or take a canoe ride.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Kumarakom Lake Resort",
      },
      {
        day: 10,
        title: "Departure",
        description:
          "After a leisurely breakfast, transfer to Cochin Airport for your onward journey. Carry with you the serenity of Kerala's backwaters and the warmth of its people.",
        meals: ["Breakfast"],
      },
    ],
  },
  {
    id: "himalayan-adventure",
    title: "Himalayan Adventure",
    description:
      "Trek through breathtaking mountain passes, visit ancient monasteries, and experience Tibetan culture.",
    longDescription:
      "Challenge yourself with this extraordinary adventure through the Indian Himalayas. From the spiritual haven of Rishikesh to the high-altitude deserts of Ladakh, experience landscapes that will take your breath away. This journey combines moderate treks, cultural immersion, and encounters with ancient Buddhist traditions in one of the world's most spectacular mountain regions.",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537367464443-da361c354903?q=80&w=2070&auto=format&fit=crop",
    ],
    duration: "14 Days",
    groupSize: "Max 8",
    rating: 4.9,
    reviewCount: 124,
    price: 2499,
    originalPrice: 2999,
    tag: "Adventure",
    difficulty: "Challenging",
    highlights: [
      "Trek to Triund with panoramic Himalayan views",
      "Visit the ancient Thiksey and Hemis Monasteries",
      "Drive on the world's highest motorable roads",
      "Camp under stars at 14,000 feet",
      "Rafting on the Ganges in Rishikesh",
      "Experience local Ladakhi hospitality",
    ],
    inclusions: [
      "13 nights accommodation mix of hotels, guesthouses & camps",
      "All meals during treks, breakfast elsewhere",
      "Domestic flight Delhi-Leh",
      "All trekking equipment and permits",
      "Experienced trek leader and support staff",
      "Rafting session in Rishikesh",
      "All ground transportation",
      "Porter service during treks",
    ],
    exclusions: [
      "International flights",
      "Travel and medical insurance (mandatory)",
      "Personal trekking gear",
      "Tips and gratuities",
      "Meals in cities (except breakfast)",
      "Personal expenses",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Delhi",
        description:
          "Arrive in Delhi and transfer to your hotel. Evening briefing about the adventure ahead. Meet your fellow travelers and trip leader.",
        meals: ["Dinner"],
        accommodation: "The Claridges, Delhi",
      },
      {
        day: 2,
        title: "Delhi to Rishikesh",
        description:
          "Morning drive to Rishikesh, the yoga capital of the world. Afternoon at leisure to explore ashrams and the famous Laxman Jhula bridge. Evening Ganga Aarti ceremony.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Taj Rishikesh",
      },
      {
        day: 3,
        title: "Rafting & Adventure",
        description:
          "Morning white water rafting on the Ganges - 16km of exciting rapids. Afternoon cliff jumping and beach activities. Optional yoga session at sunset.",
        meals: ["Breakfast"],
        accommodation: "Taj Rishikesh",
      },
      {
        day: 4,
        title: "Rishikesh to Dharamshala",
        description:
          "Drive through scenic mountain roads to McLeod Ganj, home of the Dalai Lama. Visit the Tibetan monastery and explore the vibrant town.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Hyatt Regency Dharamshala",
      },
      {
        day: 5,
        title: "Triund Trek",
        description:
          "Trek to Triund (9,350 ft) through rhododendron forests. Reach the meadow campsite with stunning views of the Dhauladhar range. Night camping under stars.",
        meals: ["Breakfast", "Lunch", "Dinner"],
        accommodation: "Triund Camp",
      },
      {
        day: 6,
        title: "Trek & Return",
        description:
          "Optional early morning trek to Snowline. Descend to McLeod Ganj. Afternoon free to explore Tibetan culture, shopping, and cafes.",
        meals: ["Breakfast", "Lunch"],
        accommodation: "Hyatt Regency Dharamshala",
      },
      {
        day: 7,
        title: "Fly to Leh",
        description:
          "Drive to Amritsar, visit the Golden Temple. Evening flight to Leh (or morning flight next day). Rest for acclimatization upon arrival in Leh.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "The Grand Dragon, Leh",
      },
      {
        day: 8,
        title: "Acclimatization Day",
        description:
          "Rest day for altitude acclimatization. Gentle walk through Leh market. Visit Shanti Stupa for sunset views. Briefing for the days ahead.",
        meals: ["Breakfast"],
        accommodation: "The Grand Dragon, Leh",
      },
      {
        day: 9,
        title: "Leh Monastery Tour",
        description:
          "Visit Thiksey Monastery (mini Potala), Hemis Monastery (largest in Ladakh), and Shey Palace. Explore 1000-year old Buddhist heritage.",
        meals: ["Breakfast", "Lunch"],
        accommodation: "The Grand Dragon, Leh",
      },
      {
        day: 10,
        title: "Khardung La Excursion",
        description:
          "Drive over Khardung La Pass (17,982 ft), one of the world's highest motorable roads. Continue to Nubra Valley. Visit Diskit Monastery and sand dunes.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Nubra Ecolodge",
      },
      {
        day: 11,
        title: "Nubra to Pangong",
        description:
          "Drive to the stunning Pangong Lake (14,270 ft) through Shyok village. Witness the magical color-changing lake stretching into Tibet.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Pangong Camp",
      },
      {
        day: 12,
        title: "Pangong to Leh",
        description:
          "Morning by the lake watching the colors change. Drive back to Leh via Chang La pass. Evening celebration dinner.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "The Grand Dragon, Leh",
      },
      {
        day: 13,
        title: "Return to Delhi",
        description:
          "Morning flight to Delhi. Afternoon free for shopping or sightseeing. Farewell dinner with the group.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "The Claridges, Delhi",
      },
      {
        day: 14,
        title: "Departure",
        description:
          "Transfer to Delhi Airport for your onward journey. Depart with incredible memories and new friendships forged in the Himalayas.",
        meals: ["Breakfast"],
      },
    ],
  },
  {
    id: "royal-rajasthan-safari",
    title: "Royal Rajasthan Safari",
    description:
      "Live like royalty in heritage palaces, explore majestic forts, and witness vibrant desert culture.",
    longDescription:
      "Step into the world of Maharajas on this luxurious journey through Rajasthan. Stay in converted palaces and heritage havelis, explore magnificent forts that tell tales of valor, and immerse yourself in the colorful traditions of the desert state. From the blue city of Jodhpur to the golden sands of Jaisalmer, experience the romance and grandeur of royal India.",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2070&auto=format&fit=crop",
    ],
    duration: "12 Days",
    groupSize: "Max 14",
    rating: 4.7,
    reviewCount: 203,
    price: 2199,
    originalPrice: 2699,
    tag: "Luxury",
    difficulty: "Easy",
    highlights: [
      "Stay in converted palace hotels",
      "Camel safari in the Thar Desert",
      "Private dinner at a Maharaja's residence",
      "Hot air balloon ride over Jaipur (seasonal)",
      "Explore Mehrangarh Fort with audio guide",
      "Village safari meeting local artisans",
    ],
    inclusions: [
      "11 nights in heritage palace hotels",
      "Daily breakfast and 5 special dinners",
      "All transfers in luxury vehicles",
      "Private English-speaking guide throughout",
      "All monument entrance fees",
      "Camel safari with desert dinner",
      "Village safari experience",
      "Domestic flights as per itinerary",
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Hot air balloon (seasonal, extra cost)",
      "Personal expenses and shopping",
      "Tips and gratuities",
      "Meals not mentioned",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Delhi",
        description:
          "VIP arrival service at Delhi Airport. Transfer to your luxury hotel. Evening welcome dinner introducing you to the royal journey ahead.",
        meals: ["Dinner"],
        accommodation: "The Oberoi, New Delhi",
      },
      {
        day: 2,
        title: "Delhi to Mandawa",
        description:
          "Drive to Mandawa in the Shekhawati region, known as the open-air art gallery of Rajasthan. Explore painted havelis with stunning frescoes.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Castle Mandawa",
      },
      {
        day: 3,
        title: "Mandawa to Bikaner",
        description:
          "Continue to Bikaner, visiting Junagarh Fort, one of India's most impressive forts. Evening heritage walk through the old city.",
        meals: ["Breakfast"],
        accommodation: "Laxmi Niwas Palace",
      },
      {
        day: 4,
        title: "Bikaner to Jaisalmer",
        description:
          "Drive through the Thar Desert to the golden city of Jaisalmer. Afternoon at leisure. Evening walk around the living fort.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Suryagarh, Jaisalmer",
      },
      {
        day: 5,
        title: "Golden City Exploration",
        description:
          "Explore Jaisalmer Fort, Patwon Ki Haveli, and Salim Singh Ki Haveli. Afternoon camel safari into the desert dunes with sunset dinner under stars.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Suryagarh, Jaisalmer",
      },
      {
        day: 6,
        title: "Jaisalmer to Jodhpur",
        description:
          "Drive to the blue city of Jodhpur. Visit Mehrangarh Fort with audio guide by the royal family. Explore the blue lanes of the old city.",
        meals: ["Breakfast"],
        accommodation: "Umaid Bhawan Palace",
      },
      {
        day: 7,
        title: "Jodhpur Heritage",
        description:
          "Morning village safari meeting local artisans. Visit Jaswant Thada memorial. Evening private dinner at a nobleman's haveli.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Umaid Bhawan Palace",
      },
      {
        day: 8,
        title: "Jodhpur to Udaipur",
        description:
          "Scenic drive to Udaipur via Ranakpur Jain Temples with intricate marble carvings. Arrive in the city of lakes by evening.",
        meals: ["Breakfast"],
        accommodation: "Taj Lake Palace",
      },
      {
        day: 9,
        title: "Venice of the East",
        description:
          "Full day exploring Udaipur - City Palace, Jagdish Temple, and boat ride on Lake Pichola. Evening cultural show.",
        meals: ["Breakfast"],
        accommodation: "Taj Lake Palace",
      },
      {
        day: 10,
        title: "Udaipur to Jaipur",
        description:
          "Fly to Jaipur. Afternoon at leisure. Optional hot air balloon ride at dawn (next morning, seasonal). Evening bazaar exploration.",
        meals: ["Breakfast"],
        accommodation: "Rambagh Palace",
      },
      {
        day: 11,
        title: "Pink City Splendor",
        description:
          "Visit Amber Fort, City Palace, and Hawa Mahal. Afternoon cooking class learning royal Rajasthani cuisine. Farewell gala dinner.",
        meals: ["Breakfast", "Dinner"],
        accommodation: "Rambagh Palace",
      },
      {
        day: 12,
        title: "Departure",
        description:
          "Leisurely breakfast. Transfer to Jaipur Airport or Delhi. Depart with memories of royal Rajasthan and its timeless grandeur.",
        meals: ["Breakfast"],
      },
    ],
  },
]

export function getTourById(id: string): Tour | undefined {
  return tours.find((tour) => tour.id === id)
}

export function getAllTourIds(): string[] {
  return tours.map((tour) => tour.id)
}
