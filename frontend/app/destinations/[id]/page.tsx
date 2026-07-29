import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getDestinationById, getAllDestinationIds } from "@/lib/destinations-data"
import { tours } from "@/lib/tours-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Clock,
  Globe,
  Thermometer,
  Languages,
  Banknote,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Check,
} from "lucide-react"
import { DestinationGallery } from "./destination-gallery"

export async function generateStaticParams() {
  const ids = getAllDestinationIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const destination = getDestinationById(id)

  if (!destination) {
    return { title: "Destination Not Found" }
  }

  return {
    title: `${destination.name} Travel Guide - ${destination.tagline} | India Tours`,
    description: `${destination.longDescription.substring(0, 155)}...`,
    keywords: [
      destination.name,
      destination.tagline,
      "India travel",
      "India tourism",
      ...destination.highlights.slice(0, 5),
      ...destination.experiences.slice(0, 3),
    ],
    openGraph: {
      title: `Explore ${destination.name} - ${destination.tagline} | Incredible India Tours`,
      description: destination.description,
      images: [
        {
          url: destination.image,
          width: 1200,
          height: 630,
          alt: `${destination.name} - ${destination.tagline}, scenic view of ${destination.highlights[0]}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Explore ${destination.name} | Incredible India Tours`,
      description: destination.description,
      images: [destination.image],
    },
    alternates: {
      canonical: `/destinations/${id}`,
    },
  }
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const destination = getDestinationById(id)

  if (!destination) {
    notFound()
  }

  // Get related tours
  const relatedToursList = tours.filter((t) =>
    destination.relatedTours.includes(t.id)
  )

  // JSON-LD Schema for the destination
  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.longDescription,
    image: destination.gallery,
    touristType: ["Cultural tourist", "Adventure tourist", "Leisure tourist"],
    geo: {
      "@type": "GeoCoordinates",
      name: destination.name,
    },
    includesAttraction: destination.popularAttractions.map((attraction) => ({
      "@type": "TouristAttraction",
      name: attraction.name,
      description: attraction.description,
      image: attraction.image,
    })),
    publicAccess: true,
    isAccessibleForFree: true,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(destinationSchema),
        }}
      />
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[70vh]">
          <Image
            src={destination.image}
            alt={`${destination.name} - ${destination.tagline}, featuring stunning views of ${destination.highlights[0]}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
              <Badge className="bg-accent text-accent-foreground mb-4">
                {destination.tagline}
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-background mb-4 text-balance">
                {destination.name}
              </h1>
              <p className="text-background/90 text-lg md:text-xl max-w-2xl text-pretty">
                {destination.description}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-primary text-primary-foreground py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Best Time: {destination.bestTimeToVisit}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                <span>{destination.climate.split(",")[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                <span>{destination.languages.slice(0, 2).join(", ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{destination.timeZone}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                  About {destination.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {destination.longDescription}
                </p>
              </div>

              {/* Gallery */}
              <DestinationGallery
                images={destination.gallery}
                name={destination.name}
              />

              {/* Highlights */}
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Places to Visit
                </h2>
                <div className="flex flex-wrap gap-3">
                  {destination.highlights.map((highlight) => (
                    <Badge
                      key={highlight}
                      variant="secondary"
                      className="px-4 py-2 text-sm"
                    >
                      <MapPin className="w-3 h-3 mr-2" />
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Popular Attractions */}
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Popular Attractions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {destination.popularAttractions.map((attraction, index) => (
                    <Card key={index} className="overflow-hidden group">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={attraction.image}
                          alt={`${attraction.name} - popular attraction in ${destination.name}, India`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-serif font-bold text-foreground mb-2">
                          {attraction.name}
                        </h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                          {attraction.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Experiences */}
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Things to Do
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.experiences.map((experience, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">{experience}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Travel Info Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                    Travel Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">
                          Best Time to Visit
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {destination.bestTimeToVisit}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <Thermometer className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Climate</p>
                        <p className="text-sm text-muted-foreground">
                          {destination.climate}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <Languages className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Languages</p>
                        <p className="text-sm text-muted-foreground">
                          {destination.languages.join(", ")}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <Banknote className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Currency</p>
                        <p className="text-sm text-muted-foreground">
                          {destination.currency}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Time Zone</p>
                        <p className="text-sm text-muted-foreground">
                          {destination.timeZone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    render={<Link href="/#tours" />}
                  >
                    Explore Tours
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Tours */}
        {relatedToursList.length > 0 && (
          <section className="bg-secondary/50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Tours in {destination.name}
                </h2>
                <p className="text-muted-foreground">
                  Explore our curated tour packages featuring {destination.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedToursList.map((tour) => (
                  <Card
                    key={tour.id}
                    className="overflow-hidden group hover:shadow-xl transition-shadow"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={tour.image}
                        alt={`${tour.title} - ${tour.duration} tour package in India`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                        {tour.tag}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                        {tour.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {tour.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {tour.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            {tour.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            From
                          </span>
                          <p className="font-serif text-xl font-bold text-primary">
                            ${tour.price}
                          </p>
                        </div>
                        <Button size="sm" render={<Link href={`/tours/${tour.id}`} />}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
