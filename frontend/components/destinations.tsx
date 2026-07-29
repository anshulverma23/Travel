"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import { destinations } from "@/lib/destinations-data"

export function Destinations() {
  return (
    <section id="destinations" className="py-20 md:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-accent font-medium text-sm uppercase tracking-widest mb-4">
            Popular Destinations
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Explore India&apos;s Most Enchanting Places
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Each region of India tells a unique story. Discover the diverse
            landscapes, cultures, and experiences that await you.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Link
              href={`/destinations/${destination.id}`}
              key={destination.id}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${
                  index === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={destination.image}
                  alt={`${destination.name} - ${destination.tagline}, scenic travel destination in India`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{destination.tagline}</span>
                </div>
                <h3
                  className={`font-serif font-bold text-white mb-3 ${
                    index === 0 ? "text-3xl md:text-4xl" : "text-2xl"
                  }`}
                >
                  {destination.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {destination.highlights.slice(0, 3).map((highlight) => (
                    <Badge
                      key={highlight}
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
