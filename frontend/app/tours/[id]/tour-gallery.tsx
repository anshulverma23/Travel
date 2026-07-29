"use client"

import Image from "next/image"
import { useState } from "react"

interface TourGalleryProps {
  images: string[]
  title: string
}

const imageDescriptions = [
  "Stunning main view of the tour destination",
  "Local cultural experience and heritage site",
  "Scenic landscape and natural beauty",
  "Authentic local cuisine and dining experience",
]

export function TourGallery({ images, title }: TourGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const getAltText = (index: number) => {
    const description = imageDescriptions[index] || `Gallery image ${index + 1}`
    return `${title} tour - ${description}`
  }

  return (
    <div>
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
        Gallery
      </h2>
      <div className="space-y-4">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
          <Image
            src={images[selectedImage]}
            alt={getAltText(selectedImage)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all ${
                selectedImage === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`View ${getAltText(index)}`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 200px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
