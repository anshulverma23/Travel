"use client"

import { useEffect, useState } from "react"
import { AdminTable, type AdminColumn } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { useToast } from "@/context/toast-context"
import { formatDate } from "@/lib/format"
import { reviewApi, ApiError } from "@/lib/api"
import type { Review } from "@/lib/types"

export default function AdminReviewsPage() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    reviewApi.adminList({ limit: 50 }).then((res) => setReviews(res.reviews)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (review: Review) => {
    if (!confirm("Delete this review?")) return
    try {
      await reviewApi.remove(review._id)
      toast("Review deleted")
      load()
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not delete review", "error")
    }
  }

  const columns: AdminColumn<Review>[] = [
    { key: "user", label: "User", render: (r) => (typeof r.user === "object" ? r.user.name : "—") },
    {
      key: "target", label: "For", render: (r) => {
        const target = r.hotel || r.package
        const name = typeof target === "object" ? target?.name : "—"
        return <span>{name} <Badge variant="outline" className="ml-1">{r.targetType}</Badge></span>
      },
    },
    { key: "rating", label: "Rating", render: (r) => <StarRating rating={r.rating} /> },
    { key: "comment", label: "Comment", render: (r) => <span className="line-clamp-2 max-w-xs block">{r.comment}</span> },
    { key: "verified", label: "Verified", render: (r) => r.isVerifiedBooking ? <Badge className="bg-primary/10 text-primary">Yes</Badge> : <Badge variant="outline">No</Badge> },
    { key: "createdAt", label: "Date", render: (r) => formatDate(r.createdAt) },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground mb-6">Manage Reviews</h1>
      <AdminTable columns={columns} rows={reviews} loading={loading} onDelete={handleDelete} />
    </div>
  )
}
