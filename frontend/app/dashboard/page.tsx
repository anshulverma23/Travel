"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ClipboardList, Heart, User as UserIcon, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RequireAuth } from "@/components/route-guards"
import { PageLoader } from "@/components/ui/spinner"
import { formatINR, formatDate } from "@/lib/format"
import { useAuth } from "@/context/auth-context"
import { bookingApi, wishlistApi } from "@/lib/api"
import type { Booking } from "@/lib/types"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-secondary text-secondary-foreground",
}

function DashboardContent() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([bookingApi.my(), wishlistApi.get()])
      .then(([b, w]) => {
        setBookings(b.bookings)
        setWishlistCount(w.wishlist.items.length)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader label="Loading your dashboard..." />

  const upcoming = bookings.filter((b) => b.bookingStatus !== "cancelled").slice(0, 5)

  return (
    <main className="min-h-screen pt-28 pb-20 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Welcome back, {user?.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground">Here&apos;s a quick look at your account.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/bookings">
            <Card className="p-5 hover:shadow-md transition-shadow">
              <ClipboardList className="size-6 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </Card>
          </Link>
          <Link href="/wishlist">
            <Card className="p-5 hover:shadow-md transition-shadow">
              <Heart className="size-6 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{wishlistCount}</p>
              <p className="text-sm text-muted-foreground">Wishlist Items</p>
            </Card>
          </Link>
          <Link href="/profile">
            <Card className="p-5 hover:shadow-md transition-shadow">
              <UserIcon className="size-6 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">Profile</p>
              <p className="text-sm text-muted-foreground">Manage your details</p>
            </Card>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-foreground">Recent Bookings</h2>
          <Link href="/bookings" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <Card className="mt-4 p-8 text-center text-muted-foreground">
            No bookings yet. <Link href="/hotels" className="text-primary hover:underline">Start exploring hotels</Link> or{" "}
            <Link href="/packages" className="text-primary hover:underline">tour packages</Link>.
          </Card>
        ) : (
          <div className="mt-4 space-y-3">
            {upcoming.map((b) => {
              const title = b.bookingType === "hotel"
                ? (typeof b.hotel === "object" ? b.hotel?.name : "Hotel booking")
                : (typeof b.package === "object" ? b.package?.name : "Package booking")
              return (
                <Link key={b._id} href={`/bookings/${b._id}`}>
                  <Card className="p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div>
                      <p className="font-medium text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground">{b.invoiceNumber} · {formatDate(b.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{formatINR(b.pricing.totalAmount)}</span>
                      <Badge className={statusColors[b.bookingStatus]}>{b.bookingStatus}</Badge>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <DashboardContent />
      </RequireAuth>
      <Footer />
    </>
  )
}
