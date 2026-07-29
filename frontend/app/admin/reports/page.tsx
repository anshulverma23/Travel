"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { PageLoader } from "@/components/ui/spinner"
import { formatINR } from "@/lib/format"
import { adminApi } from "@/lib/api"

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AdminReportsPage() {
  const [revenue, setRevenue] = useState<{ _id: { year: number; month: number }; total: number; count: number }[]>([])
  const [byStatus, setByStatus] = useState<{ _id: string; count: number }[]>([])
  const [byType, setByType] = useState<{ _id: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminApi.revenueReport(), adminApi.bookingReport()])
      .then(([rev, book]) => {
        setRevenue(rev.revenue)
        setByStatus(book.byStatus)
        setByType(book.byType)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader label="Loading reports..." />

  const maxRevenue = Math.max(...revenue.map((r) => r.total), 1)
  const totalBookings = byStatus.reduce((sum, s) => sum + s.count, 0) || 1

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Reports</h1>

      <Card className="p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-6">Revenue (Last 12 Months)</h2>
        {revenue.length === 0 ? (
          <p className="text-sm text-muted-foreground">No paid bookings yet.</p>
        ) : (
          <div className="flex items-end gap-3 h-48">
            {revenue.map((r) => (
              <div key={`${r._id.year}-${r._id.month}`} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                <span className="text-[10px] text-muted-foreground">{formatINR(r.total)}</span>
                <div
                  className="w-full rounded-t-md bg-primary transition-all"
                  style={{ height: `${Math.max((r.total / maxRevenue) * 100, 3)}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{MONTH_NAMES[r._id.month - 1]}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-4">Bookings by Status</h2>
          <div className="space-y-3">
            {byStatus.map((s) => (
              <div key={s._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-foreground">{s._id}</span>
                  <span className="text-muted-foreground">{s.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(s.count / totalBookings) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-4">Bookings by Type</h2>
          <div className="space-y-3">
            {byType.map((t) => (
              <div key={t._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-foreground">{t._id}</span>
                  <span className="text-muted-foreground">{t.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${(t.count / totalBookings) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
