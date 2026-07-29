"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { RequireAuth } from "@/components/route-guards"
import { PageLoader } from "@/components/ui/spinner"
import { formatINR, formatDate } from "@/lib/format"
import { bookingApi } from "@/lib/api"
import type { Booking } from "@/lib/types"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-secondary text-secondary-foreground",
}

function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    bookingApi
      .my()
      .then(({ bookings }) => setBookings(bookings))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader label="Loading your bookings..." />

  const filtered = filter ? bookings.filter((b) => b.bookingStatus === filter) : bookings

  return (
    <main className="min-h-screen pt-28 pb-20 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold text-foreground">My Bookings</h1>
          <div className="w-44">
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">No bookings match this filter.</Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => {
              const title = b.bookingType === "hotel"
                ? (typeof b.hotel === "object" ? b.hotel?.name : "Hotel booking")
                : (typeof b.package === "object" ? b.package?.name : "Package booking")
              return (
                <Link key={b._id} href={`/bookings/${b._id}`}>
                  <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:shadow-sm transition-shadow">
                    <div>
                      <p className="font-medium text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.invoiceNumber} · Booked {formatDate(b.createdAt)} · {b.bookingType === "hotel" ? "Hotel" : "Package"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{formatINR(b.pricing.totalAmount)}</span>
                      <Badge className={statusColors[b.bookingStatus]}>{b.bookingStatus}</Badge>
                      <Badge variant="outline">{b.paymentStatus}</Badge>
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

export default function BookingsPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <BookingsContent />
      </RequireAuth>
      <Footer />
    </>
  )
}
