"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Star, ArrowRight } from "lucide-react"
import { tours } from "@/lib/tours-data"

export function Tours() {
  return (
    <section id="tours" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-accent font-medium text-sm uppercase tracking-widest mb-4">
              Featured Tours
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Handcrafted Journeys for Every Traveler
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground self-start md:self-auto"
          >
            View All Tours
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tours.map((tour) => (
            <Card
              key={tour.title}
              className="group overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="relative lg:w-2/5 aspect-[4/3] lg:aspect-auto">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    {tour.tag}
                  </Badge>
                </div>
                <CardContent className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-accent mb-2">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{tour.rating}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                      {tour.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 text-pretty">
                      {tour.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{tour.groupSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          From
                        </span>
                        <p className="font-serif text-2xl font-bold text-primary">
                          ${tour.price}
                        </p>
                      </div>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90" render={<Link href={`/tours/${tour.id}`} />}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
