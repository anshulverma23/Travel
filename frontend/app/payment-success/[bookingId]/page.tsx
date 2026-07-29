"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Download } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageLoader } from "@/components/ui/spinner"
import { RequireAuth } from "@/components/route-guards"
import { formatINR } from "@/lib/format"
import { bookingApi } from "@/lib/api"
import type { Booking } from "@/lib/types"

function PaymentSuccessContent() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingApi
      .get(bookingId)
      .then(({ booking }) => setBooking(booking))
      .finally(() => setLoading(false))
  }, [bookingId])

  if (loading) return <PageLoader />

  return (
    <main className="min-h-screen pt-28 pb-20 bg-muted/30 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 size-14 text-primary" />
        <h1 className="font-serif text-2xl font-bold text-foreground">Booking Confirmed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your payment was successful. A confirmation email is on its way.
        </p>

        {booking && (
          <div className="mt-6 rounded-lg bg-muted p-4 text-left text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Invoice #</span><span className="font-medium">{booking.invoiceNumber}</span></div>
            <div className="flex justify-between mt-1"><span className="text-muted-foreground">Amount Paid</span><span className="font-medium">{formatINR(booking.pricing.totalAmount)}</span></div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {booking && (
            <Button variant="outline" onClick={() => bookingApi.downloadInvoice(booking._id, booking.invoiceNumber)}>
              <Download className="size-4 mr-2" /> Download Invoice
            </Button>
          )}
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" render={<Link href="/bookings" />}>
            View My Bookings
          </Button>
        </div>
      </Card>
    </main>
  )
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <PaymentSuccessContent />
      </RequireAuth>
      <Footer />
    </>
  )
}
