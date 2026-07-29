"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tag, ShieldCheck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { PageLoader } from "@/components/ui/spinner"
import { RequireAuth } from "@/components/route-guards"
import { formatINR, formatDate } from "@/lib/format"
import { loadRazorpayScript } from "@/lib/razorpay"
import { useAuth } from "@/context/auth-context"
import { bookingApi, paymentApi, ApiError } from "@/lib/api"
import type { Booking, Hotel, Room, TourPackage } from "@/lib/types"

function CheckoutContent() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()
  const { user } = useAuth()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null)
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState("")

  const loadBooking = () => {
    bookingApi
      .get(bookingId)
      .then(({ booking }) => setBooking(booking))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false))
  }

  useEffect(loadBooking, [bookingId])

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setApplyingCoupon(true)
    setCouponMsg(null)
    try {
      const { booking } = await bookingApi.applyCoupon(bookingId, couponCode.trim())
      setBooking(booking)
      setCouponMsg({ text: booking.pricing.discount > 0 ? `Coupon applied! You saved ${formatINR(booking.pricing.discount)}` : "Coupon applied" })
    } catch (err) {
      setCouponMsg({ text: err instanceof ApiError ? err.message : "Could not apply coupon", error: true })
    } finally {
      setApplyingCoupon(false)
    }
  }

  const handlePay = async () => {
    if (!booking) return
    setPayError("")
    setPaying(true)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) throw new Error("Could not load the payment gateway. Please check your connection.")

      const order = await paymentApi.createRazorpayOrder(booking._id)

      const RazorpayCtor = (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay
      const rzp = new RazorpayCtor({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "India Travel",
        description: `Booking #${booking.invoiceNumber}`,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#1a5f4a" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await paymentApi.verifyRazorpay({ ...response, bookingId: booking._id })
            router.push(`/payment-success/${booking._id}`)
          } catch (err) {
            setPayError(err instanceof ApiError ? err.message : "Payment verification failed")
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      })
      rzp.open()
    } catch (err) {
      setPayError(err instanceof ApiError || err instanceof Error ? err.message : "Could not start payment")
      setPaying(false)
    }
  }

  if (loading) return <PageLoader label="Loading your booking..." />
  if (!booking) return <p className="py-32 text-center text-muted-foreground">Booking not found.</p>

  if (booking.paymentStatus === "paid") {
    router.replace(`/payment-success/${booking._id}`)
    return <PageLoader />
  }

  const hotel = typeof booking.hotel === "object" ? (booking.hotel as Hotel) : null
  const room = typeof booking.room === "object" ? (booking.room as Room) : null
  const pkg = typeof booking.package === "object" ? (booking.package as TourPackage) : null

  return (
    <main className="min-h-screen pt-28 pb-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="md:col-span-3 p-6">
            <h2 className="font-semibold text-foreground mb-4">Booking Summary</h2>
            {booking.bookingType === "hotel" ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-foreground">{hotel?.name || "Hotel"}</p>
                {room && <p className="text-muted-foreground">{room.roomType} Room × {booking.numberOfRooms}</p>}
                <p className="text-muted-foreground">Check-in: {booking.checkIn && formatDate(booking.checkIn)}</p>
                <p className="text-muted-foreground">Check-out: {booking.checkOut && formatDate(booking.checkOut)}</p>
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-foreground">{pkg?.name || "Tour Package"}</p>
                <p className="text-muted-foreground">Travel date: {booking.travelDate && formatDate(booking.travelDate)}</p>
              </div>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Guests: {booking.guests.adults} adult{booking.guests.adults > 1 ? "s" : ""}
              {booking.guests.children > 0 && `, ${booking.guests.children} children`}
            </p>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-1.5 text-sm"><Tag className="size-4" /> Have a coupon?</h3>
              <div className="flex gap-2">
                <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="e.g. WELCOME10" />
                <Button variant="outline" onClick={applyCoupon} disabled={applyingCoupon}>
                  {applyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
              {couponMsg && (
                <p className={`mt-2 text-xs ${couponMsg.error ? "text-destructive" : "text-primary"}`}>{couponMsg.text}</p>
              )}
            </div>
          </Card>

          <Card className="md:col-span-2 p-6 h-fit">
            <h2 className="font-semibold text-foreground mb-4">Price Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Base price</span><span>{formatINR(booking.pricing.basePrice)}</span></div>
              {booking.pricing.discount > 0 && (
                <div className="flex justify-between text-primary"><span>Discount</span><span>-{formatINR(booking.pricing.discount)}</span></div>
              )}
              <div className="flex justify-between text-muted-foreground"><span>Taxes</span><span>{formatINR(booking.pricing.tax)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground text-base">
                <span>Total</span><span>{formatINR(booking.pricing.totalAmount)}</span>
              </div>
            </div>

            {payError && <Alert variant="destructive" className="mt-4">{payError}</Alert>}

            <Button onClick={handlePay} disabled={paying} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5">
              {paying ? "Processing..." : `Pay ${formatINR(booking.pricing.totalAmount)}`}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Secured by Razorpay
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <CheckoutContent />
      </RequireAuth>
      <Footer />
    </>
  )
}
