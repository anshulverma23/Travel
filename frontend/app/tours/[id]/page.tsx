import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTourById, getAllTourIds } from "@/lib/tours-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Clock,
  Users,
  Star,
  MapPin,
  Check,
  X,
  Calendar,
  Mountain,
  Utensils,
  Building,
} from "lucide-react"
import { TourGallery } from "./tour-gallery"
import { TourBookingCard } from "./tour-booking-card"

export async function generateStaticParams() {
  const ids = getAllTourIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const tour = getTourById(id)

  if (!tour) {
    return { title: "Tour Not Found" }
  }

  return {
    title: `${tour.title} - ${tour.duration} India Tour Package`,
    description: `${tour.longDescription.substring(0, 155)}...`,
    keywords: [
      tour.title,
      "India tour",
      tour.tag,
      tour.difficulty,
      "travel India",
      ...tour.highlights.slice(0, 3),
    ],
    openGraph: {
      title: `${tour.title} | Incredible India Tours`,
      description: tour.description,
      images: [
        {
          url: tour.image,
          width: 1200,
          height: 630,
          alt: `${tour.title} - ${tour.tag} tour in India`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tour.title} | Incredible India Tours`,
      description: tour.description,
      images: [tour.image],
    },
    alternates: {
      canonical: `/tours/${id}`,
    },
  }
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const tour = getTourById(id)

  if (!tour) {
    notFound()
  }

  // JSON-LD Schema for the tour
  const tourSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.longDescription,
    image: tour.gallery,
    touristType: tour.tag === "Adventure" ? "Adventure tourist" : tour.tag === "Wellness" ? "Wellness tourist" : "Cultural tourist",
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.itinerary.map((day, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TouristAttraction",
          name: `Day ${day.day}: ${day.title}`,
          description: day.description,
        },
      })),
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    provider: {
      "@type": "TravelAgency",
      name: "Incredible India Tours",
      url: "https://incredibleindiatours.com",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.rating,
      reviewCount: tour.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tourSchema),
        }}
      />
      <Header />
      <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <Image
          src={tour.image}
          alt={`${tour.title} - ${tour.tag} tour featuring ${tour.highlights[0]}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Badge className="bg-accent text-accent-foreground mb-4">
              {tour.tag}
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-background mb-4 text-balance">
              {tour.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-background/90">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{tour.groupSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                <span>{tour.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span>
                  {tour.rating} ({tour.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                Tour Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {tour.longDescription}
              </p>
            </div>

            {/* Gallery */}
            <TourGallery images={tour.gallery} title={tour.title} />

            {/* Highlights */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                Tour Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                Day-by-Day Itinerary
              </h2>
              <div className="space-y-4">
                {tour.itinerary.map((day, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="bg-primary text-primary-foreground p-6 md:w-32 flex md:flex-col items-center justify-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span className="font-bold">Day {day.day}</span>
                        </div>
                        <div className="p-6 flex-1">
                          <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                            {day.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 text-pretty">
                            {day.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            {day.meals.length > 0 && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Utensils className="w-4 h-4" />
                                <span>{day.meals.join(", ")}</span>
                              </div>
                            )}
                            {day.accommodation && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Building className="w-4 h-4" />
                                <span>{day.accommodation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  What&apos;s Included
                </h3>
                <ul className="space-y-3">
                  {tour.inclusions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <X className="w-5 h-5 text-destructive" />
                  Not Included
                </h3>
                <ul className="space-y-3">
                  {tour.exclusions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <X className="w-4 h-4 text-destructive shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <TourBookingCard tour={tour} />
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  )
}
