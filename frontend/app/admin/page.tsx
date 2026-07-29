"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Building2, MapPinned, Package, ClipboardList, Star, IndianRupee } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageLoader } from "@/components/ui/spinner"
import { formatINR, formatDate } from "@/lib/format"
import { adminApi } from "@/lib/api"
import type { Booking } from "@/lib/types"

const statCards = [
  { key: "totalUsers", label: "Users", icon: Users },
  { key: "totalHotels", label: "Hotels", icon: Building2 },
  { key: "totalDestinations", label: "Destinations", icon: MapPinned },
  { key: "totalPackages", label: "Packages", icon: Package },
  { key: "totalBookings", label: "Bookings", icon: ClipboardList },
  { key: "totalReviews", label: "Reviews", icon: Star },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi
      .dashboard()
      .then((res) => {
        setStats(res.stats)
        setRecentBookings(res.recentBookings)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) return <PageLoader label="Loading dashboard..." />

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <Card className="p-5 bg-primary text-primary-foreground">
          <IndianRupee className="size-5 mb-2 opacity-90" />
          <p className="text-2xl font-bold">{formatINR(stats.totalRevenue || 0)}</p>
          <p className="text-sm opacity-90">Total Revenue</p>
        </Card>
        {statCards.map(({ key, label, icon: Icon }) => (
          <Card key={key} className="p-5">
            <Icon className="size-5 mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{stats[key] ?? 0}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">No bookings yet.</Card>
        ) : (
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {recentBookings.map((b) => {
              const userObj = typeof b.user === "object" ? b.user : null
              return (
                <Link key={b._id} href={`/admin/bookings`} className="flex items-center justify-between p-4 hover:bg-muted/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{userObj?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{b.invoiceNumber} · {formatDate(b.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{formatINR(b.pricing.totalAmount)}</span>
                    <Badge variant="outline">{b.bookingStatus}</Badge>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
