"use client"

import { useEffect, useState } from "react"
import { AdminTable, type AdminColumn } from "@/components/admin/data-table"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/context/toast-context"
import { formatINR, formatDate } from "@/lib/format"
import { bookingApi, ApiError } from "@/lib/api"
import type { Booking, User, Hotel, TourPackage } from "@/lib/types"

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "completed"]

export default function AdminBookingsPage() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")

  const load = () => {
    setLoading(true)
    bookingApi.adminList({ status: statusFilter, limit: 50 }).then((res) => setBookings((res.bookings as Booking[]) || [])).finally(() => setLoading(false))
  }

  useEffect(load, [statusFilter])

  const updateStatus = async (booking: Booking, status: string) => {
    try {
      await bookingApi.updateStatus(booking._id, status)
      toast("Booking status updated")
      load()
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not update status", "error")
    }
  }

  const columns: AdminColumn<Booking>[] = [
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "user", label: "Customer", render: (b) => (typeof b.user === "object" ? (b.user as User).name : "—") },
    {
      key: "item", label: "Item", render: (b) =>
        b.bookingType === "hotel"
          ? (typeof b.hotel === "object" ? (b.hotel as Hotel)?.name : "Hotel")
          : (typeof b.package === "object" ? (b.package as TourPackage)?.name : "Package"),
    },
    { key: "createdAt", label: "Date", render: (b) => formatDate(b.createdAt) },
    { key: "amount", label: "Amount", render: (b) => formatINR(b.pricing.totalAmount) },
    { key: "paymentStatus", label: "Payment", render: (b) => <Badge variant="outline">{b.paymentStatus}</Badge> },
    {
      key: "bookingStatus", label: "Status", render: (b) => (
        <Select value={b.bookingStatus} onChange={(e) => updateStatus(b, e.target.value)} className="h-7 text-xs">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Manage Bookings</h1>
        <div className="w-44">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      <AdminTable columns={columns} rows={bookings} loading={loading} />
    </div>
  )
}
