"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { MapPin, Calendar, Cloud, Droplets } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { PageLoader } from "@/components/ui/spinner"
import { HotelCard } from "@/components/hotel-card"
import { PackageCard } from "@/components/package-card"
import { MapEmbed } from "@/components/map-embed"
import { destinationApi } from "@/lib/api"
import type { Destination, Hotel, TourPackage } from "@/lib/types"

export default function DestinationExplorePage() {
  const { id } = useParams<{ id: string }>()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [packages, setPackages] = useState<TourPackage[]>([])
  const [weather, setWeather] = useState<{ temp: number; feelsLike: number; condition: string; icon: string; humidity: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    destinationApi
      .get(id)
      .then((res) => {
        setDestination(res.destination)
        setHotels(res.hotels)
        setPackages(res.packages)
      })
      .catch(() => setDestination(null))
      .finally(() => setLoading(false))

    destinationApi
      .weather(id)
      .then((res) => setWeather(res.weather || null))
      .catch(() => setWeather(null))
  }, [id])

  if (loading) return (<><Header /><PageLoader label="Loading destination..." /><Footer /></>)
  if (!destination) return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20 text-center">
        <p className="text-muted-foreground">Destination not found.</p>
      </main>
      <Footer />
    </>
  )

  const gallery = destination.gallery.length ? destination.gallery : []

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 bg-background">
        <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
          {gallery[0] ? (
            <Image src={gallery[0].url} alt={destination.name} fill className="object-cover" priority />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {destination.tags.map((t) => (
                <Badge key={t} className="bg-white/15 text-white backdrop-blur-sm border-0">{t}</Badge>
              ))}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">{destination.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-white/85">
              <MapPin className="size-4" /> {destination.city}, {destination.state}, {destination.country}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">About {destination.name}</h2>
              <p className="leading-relaxed text-foreground/90">{destination.description}</p>

              {gallery.length > 1 && (
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {gallery.slice(1, 7).map((img) => (
                    <div key={img.public_id} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image src={img.url} alt={destination.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {destination.coordinates?.lat && (
                <div className="mt-8">
                  <h2 className="font-serif text-xl font-bold text-foreground mb-4">Location</h2>
                  <MapEmbed lat={destination.coordinates.lat} lng={destination.coordinates.lng} label={destination.name} />
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-4">
              {destination.bestTimeToVisit && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground"><Calendar className="size-4 text-primary" /> Best Time to Visit</p>
                  <p className="mt-1 text-sm text-muted-foreground">{destination.bestTimeToVisit}</p>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground"><Cloud className="size-4 text-primary" /> Live Weather</p>
                {weather ? (
                  <div className="mt-2 flex items-center gap-3">
                    {weather.icon && (
                      <Image src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.condition} width={48} height={48} unoptimized />
                    )}
                    <div>
                      <p className="text-2xl font-bold text-foreground">{Math.round(weather.temp)}°C</p>
                      <p className="text-xs capitalize text-muted-foreground">{weather.condition} · feels {Math.round(weather.feelsLike)}°C</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                      <Droplets className="size-3.5" /> {weather.humidity}%
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">Live weather isn&apos;t available right now.</p>
                )}
              </div>
            </div>
          </div>

          {hotels.length > 0 && (
            <div className="mt-14">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Nearby Hotels</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((h) => <HotelCard key={h._id} hotel={h} />)}
              </div>
            </div>
          )}

          {packages.length > 0 && (
            <div className="mt-14">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Tour Packages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((p) => <PackageCard key={p._id} pkg={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
