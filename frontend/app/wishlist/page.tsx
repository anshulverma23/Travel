"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HotelCard } from "@/components/hotel-card"
import { PackageCard } from "@/components/package-card"
import { RequireAuth } from "@/components/route-guards"
import { PageLoader } from "@/components/ui/spinner"
import { wishlistApi } from "@/lib/api"
import type { Hotel, TourPackage, WishlistItem } from "@/lib/types"

function WishlistContent() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    wishlistApi
      .get()
      .then(({ wishlist }) => setItems(wishlist.items))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader label="Loading your wishlist..." />

  return (
    <main className="min-h-screen pt-28 pb-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
            Your wishlist is empty. Tap the heart icon on any hotel or package to save it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) =>
              item.itemType === "Hotel" ? (
                <HotelCard key={(item.item as Hotel)._id} hotel={item.item as Hotel} />
              ) : (
                <PackageCard key={(item.item as TourPackage)._id} pkg={item.item as TourPackage} />
              )
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default function WishlistPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <WishlistContent />
      </RequireAuth>
      <Footer />
    </>
  )
}
