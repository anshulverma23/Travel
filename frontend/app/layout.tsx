import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { AuthProvider } from "@/context/auth-context"
import { ToastProvider } from "@/context/toast-context"
import "./globals.css"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Incredible India Tours | Discover the Magic of India",
    template: "%s | Incredible India Tours",
  },
  description:
    "Experience the enchanting beauty of India with our curated tours. From the majestic Taj Mahal to serene Kerala backwaters, Rajasthan palaces to Himalayan adventures. Book your dream India tour today!",
  keywords: [
    "India tours",
    "travel India",
    "Taj Mahal tour",
    "Kerala backwaters",
    "Rajasthan tours",
    "Golden Triangle tour",
    "Himalayan adventure",
    "cultural tours India",
    "spiritual journeys",
    "India travel packages",
    "luxury India tours",
    "heritage tours India",
    "wildlife safari India",
    "Ayurvedic retreats",
    "India vacation packages",
  ],
  authors: [{ name: "Incredible India Tours" }],
  creator: "Incredible India Tours",
  publisher: "Incredible India Tours",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://incredibleindiatours.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://incredibleindiatours.com",
    siteName: "Incredible India Tours",
    title: "Incredible India Tours | Discover the Magic of India",
    description:
      "Experience the enchanting beauty of India with our curated tours. From the majestic Taj Mahal to serene Kerala backwaters, book your dream India tour today!",
    images: [
      {
        url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Taj Mahal at sunrise - Incredible India Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Incredible India Tours | Discover the Magic of India",
    description:
      "Experience the enchanting beauty of India with our curated tours. From the majestic Taj Mahal to serene Kerala backwaters.",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop",
    ],
    creator: "@incredibleindiatours",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "travel",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a5f4a" },
    { media: "(prefers-color-scheme: dark)", color: "#2d7a5f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// JSON-LD Schema for organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Incredible India Tours",
  description:
    "Premier travel agency specializing in curated India tours and travel experiences",
  url: "https://incredibleindiatours.com",
  logo: "https://incredibleindiatours.com/logo.png",
  image:
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop",
  telephone: "+1-800-INDIA-TOURS",
  email: "info@incredibleindiatours.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Travel Street",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.6139,
    longitude: 77.209,
  },
  sameAs: [
    "https://www.facebook.com/incredibleindiatours",
    "https://www.instagram.com/incredibleindiatours",
    "https://twitter.com/indiatours",
    "https://www.youtube.com/incredibleindiatours",
  ],
  priceRange: "$$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1250",
  },
}

// JSON-LD Schema for website
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Incredible India Tours",
  url: "https://incredibleindiatours.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://incredibleindiatours.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

// JSON-LD Schema for tour offerings
const tourOfferSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "TouristTrip",
        name: "Golden Triangle Classic",
        description:
          "Delhi, Agra & Jaipur - The perfect introduction to India's rich heritage and the iconic Taj Mahal.",
        touristType: "Cultural tourist",
        itinerary: {
          "@type": "ItemList",
          itemListElement: ["Delhi", "Agra", "Jaipur"],
        },
        offers: {
          "@type": "Offer",
          price: "1299",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "TouristTrip",
        name: "Kerala Backwater Bliss",
        description:
          "Cruise through serene backwaters, explore spice plantations, and rejuvenate with Ayurvedic treatments.",
        touristType: "Wellness tourist",
        offers: {
          "@type": "Offer",
          price: "1899",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "TouristTrip",
        name: "Himalayan Adventure",
        description:
          "Trek through breathtaking mountain passes, visit ancient monasteries, and experience Tibetan culture.",
        touristType: "Adventure tourist",
        offers: {
          "@type": "Offer",
          price: "2499",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "TouristTrip",
        name: "Royal Rajasthan Safari",
        description:
          "Live like royalty in heritage palaces, explore majestic forts, and witness vibrant desert culture.",
        touristType: "Luxury tourist",
        offers: {
          "@type": "Offer",
          price: "2199",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} bg-background`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(tourOfferSchema),
          }}
        />
        <link rel="canonical" href="https://incredibleindiatours.com" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
