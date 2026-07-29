"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <div className="max-w-3xl">
          <p className="text-accent font-medium text-sm md:text-base uppercase tracking-widest mb-4">
            Discover the Magic
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-balance">
            Experience the Soul of{" "}
            <span className="text-primary">Incredible India</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl">
            From ancient temples to pristine beaches, from vibrant cities to
            serene mountains — embark on a journey that will touch your heart and
            transform your spirit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8"
            >
              Explore Tours
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-foreground/20 text-foreground hover:bg-foreground/5 text-base px-8"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Video
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50">
            <div>
              <p className="font-serif text-3xl md:text-4xl font-bold text-primary">
                500+
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Curated Experiences
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl font-bold text-primary">
                50K+
              </p>
              <p className="text-sm text-muted-foreground mt-1">Happy Travelers</p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl font-bold text-primary">
                29
              </p>
              <p className="text-sm text-muted-foreground mt-1">States Covered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
