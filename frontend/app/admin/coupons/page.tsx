"use client"

import { useEffect, useState } from "react"
import { AdminTable, type AdminColumn } from "@/components/admin/data-table"
import { AdminFormModal, type AdminField } from "@/components/admin/resource-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/context/toast-context"
import { formatDate } from "@/lib/format"
import { couponApi, ApiError } from "@/lib/api"
import type { Coupon } from "@/lib/types"

const fields: AdminField[] = [
  { name: "code", label: "Coupon Code", type: "text", required: true, hint: "e.g. WELCOME10" },
  { name: "discountType", label: "Discount Type", type: "select", required: true, options: [{ label: "Percentage", value: "percentage" }, { label: "Flat Amount", value: "flat" }] },
  { name: "discountValue", label: "Discount Value", type: "number", required: true },
  { name: "applicableOn", label: "Applicable On", type: "select", options: [{ label: "All", value: "all" }, { label: "Hotels Only", value: "hotel" }, { label: "Packages Only", value: "package" }] },
  { name: "minPurchaseAmount", label: "Min Purchase Amount (₹)", type: "number" },
  { name: "maxDiscountAmount", label: "Max Discount Cap (₹)", type: "number" },
  { name: "usageLimit", label: "Usage Limit", type: "number" },
  { name: "expiryDate", label: "Expiry Date", type: "date", required: true },
]

export default function AdminCouponsPage() {
  const { toast } = useToast()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)

  const load = () => {
    setLoading(true)
    couponApi.adminList().then((res) => setCoupons(res.coupons)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (values: Record<string, unknown>) => {
    const body = {
      code: String(values.code || "").toUpperCase(),
      discountType: values.discountType,
      discountValue: Number(values.discountValue),
      applicableOn: values.applicableOn || "all",
      minPurchaseAmount: Number(values.minPurchaseAmount) || 0,
      maxDiscountAmount: values.maxDiscountAmount ? Number(values.maxDiscountAmount) : undefined,
      usageLimit: Number(values.usageLimit) || 100,
      expiryDate: values.expiryDate,
    }
    if (editing) {
      await couponApi.update(editing._id, body)
      toast("Coupon updated")
    } else {
      await couponApi.create(body)
      toast("Coupon created")
    }
    load()
  }

  const handleDelete = async (c: Coupon) => {
    if (!confirm(`Delete coupon "${c.code}"?`)) return
    try {
      await couponApi.remove(c._id)
      toast("Coupon deleted")
      load()
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not delete coupon", "error")
    }
  }

  const columns: AdminColumn<Coupon>[] = [
    { key: "code", label: "Code" },
    { key: "discount", label: "Discount", render: (c) => (c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`) },
    { key: "applicableOn", label: "Applies To", render: (c) => <Badge variant="outline">{c.applicableOn}</Badge> },
    { key: "usage", label: "Usage", render: (c) => `${c.usedCount} / ${c.usageLimit}` },
    { key: "expiryDate", label: "Expires", render: (c) => formatDate(c.expiryDate) },
    { key: "isActive", label: "Status", render: (c) => <Badge variant={c.isActive ? "default" : "outline"} className={c.isActive ? "bg-primary/10 text-primary" : ""}>{c.isActive ? "Active" : "Inactive"}</Badge> },
  ]

  const initialValues = editing
    ? {
        code: editing.code,
        discountType: editing.discountType,
        discountValue: editing.discountValue,
        applicableOn: editing.applicableOn,
        minPurchaseAmount: editing.minPurchaseAmount,
        maxDiscountAmount: editing.maxDiscountAmount,
        usageLimit: editing.usageLimit,
        expiryDate: editing.expiryDate?.split("T")[0],
      }
    : { discountType: "percentage", applicableOn: "all" }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Manage Coupons</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">+ Add Coupon</Button>
      </div>

      <AdminTable
        columns={columns}
        rows={coupons}
        loading={loading}
        onEdit={(c) => { setEditing(c); setModalOpen(true) }}
        onDelete={handleDelete}
      />

      <AdminFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? "Edit Coupon" : "Add Coupon"}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
