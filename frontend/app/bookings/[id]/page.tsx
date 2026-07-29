"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Download, X, MapPin, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RequireAuth } from "@/components/route-guards"
import { PageLoader } from "@/components/ui/spinner"
import { useToast } from "@/context/toast-context"
import { formatINR, formatDate } from "@/lib/format"
import { bookingApi, ApiError } from "@/lib/api"
import type { Booking, Hotel, Room, TourPackage } from "@/lib/types"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
  completed: "bg-secondary text-secondary-foreground",
}

function BookingDetailContent() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  const load = () => {
    bookingApi
      .get(id)
      .then(({ booking }) => setBooking(booking))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const handleCancel = async () => {
    if (!confirm("Cancel this booking? This cannot be undone.")) return
    setCancelling(true)
    try {
      await bookingApi.cancel(id)
      toast("Booking cancelled")
      load()
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not cancel booking", "error")
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <PageLoader label="Loading booking..." />
  if (!booking) return <p className="py-32 text-center text-muted-foreground">Booking not found.</p>

  const hotel = typeof booking.hotel === "object" ? (booking.hotel as Hotel) : null
  const room = typeof booking.room === "object" ? (booking.room as Room) : null
  const pkg = typeof booking.package === "object" ? (booking.package as TourPackage) : null

  const canCancel = booking.bookingStatus !== "cancelled" && booking.bookingStatus !== "completed"

  return (
    <main className="min-h-screen pt-28 pb-20 bg-muted/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/bookings" className="text-sm text-muted-foreground hover:text-primary">&larr; Back to bookings</Link>

        <Card className="mt-4 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                {booking.bookingType === "hotel" ? hotel?.name : pkg?.name}
              </h1>
              <p className="text-sm text-muted-foreground">Invoice #{booking.invoiceNumber}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className={statusColors[booking.bookingStatus]}>{booking.bookingStatus}</Badge>
              <Badge variant="outline">{booking.paymentStatus}</Badge>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {booking.bookingType === "hotel" ? (
              <>
                <div className="flex items-center gap-2 text-foreground/90"><MapPin className="size-4 text-primary" /> {hotel?.location.city}, {hotel?.location.state}</div>
                <div className="flex items-center gap-2 text-foreground/90"><Calendar className="size-4 text-primary" /> {booking.checkIn && formatDate(booking.checkIn)} - {booking.checkOut && formatDate(booking.checkOut)}</div>
                {room && <div className="text-foreground/90">Room: {room.roomType} × {booking.numberOfRooms}</div>}
              </>
            ) : (
              <div className="flex items-center gap-2 text-foreground/90"><Calendar className="size-4 text-primary" /> Travel date: {booking.travelDate && formatDate(booking.travelDate)}</div>
            )}
            <div className="text-foreground/90">Guests: {booking.guests.adults} adult{booking.guests.adults > 1 ? "s" : ""}{booking.guests.children > 0 && `, ${booking.guests.children} children`}</div>
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Base price</span><span>{formatINR(booking.pricing.basePrice)}</span></div>
            {booking.pricing.discount > 0 && <div className="flex justify-between text-primary"><span>Discount</span><span>-{formatINR(booking.pricing.discount)}</span></div>}
            <div className="flex justify-between text-muted-foreground"><span>Taxes</span><span>{formatINR(booking.pricing.tax)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 mt-2 font-semibold text-foreground"><span>Total</span><span>{formatINR(booking.pricing.totalAmount)}</span></div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => bookingApi.downloadInvoice(booking._id, booking.invoiceNumber)}>
              <Download className="size-4 mr-2" /> Download Invoice
            </Button>
            {canCancel && (
              <Button variant="outline" onClick={handleCancel} disabled={cancelling} className="text-destructive border-destructive/40 hover:bg-destructive/10">
                <X className="size-4 mr-2" /> {cancelling ? "Cancelling..." : "Cancel Booking"}
              </Button>
            )}
            {booking.paymentStatus === "pending" && (
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" render={<Link href={`/checkout/${booking._id}`} />}>
                Complete Payment
              </Button>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}

export default function BookingDetailPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <BookingDetailContent />
      </RequireAuth>
      <Footer />
    </>
  )
}
