"use client"

import { useEffect, useState } from "react"
import { AdminTable, type AdminColumn } from "@/components/admin/data-table"
import { AdminFormModal, type AdminField } from "@/components/admin/resource-modal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/context/toast-context"
import { destinationApi, ApiError } from "@/lib/api"
import type { Destination } from "@/lib/types"

const fields: AdminField[] = [
  { name: "name", label: "Destination Name", type: "text", required: true },
  { name: "city", label: "City", type: "text", required: true },
  { name: "state", label: "State", type: "text", required: true },
  { name: "country", label: "Country", type: "text" },
  { name: "description", label: "Description", type: "textarea", required: true, colSpan: 2 },
  { name: "bestTimeToVisit", label: "Best Time to Visit", type: "text" },
  { name: "tags", label: "Tags", type: "text", hint: "Comma separated, e.g. Heritage, Beach" },
  { name: "lat", label: "Latitude (optional)", type: "number" },
  { name: "lng", label: "Longitude (optional)", type: "number" },
  { name: "gallery", label: "Gallery Images", type: "multifile", colSpan: 2 },
]

export default function AdminDestinationsPage() {
  const { toast } = useToast()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Destination | null>(null)

  const load = () => {
    setLoading(true)
    destinationApi.list({ limit: 50 }).then((res) => setDestinations((res.destinations as Destination[]) || [])).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (values: Record<string, unknown>) => {
    const formData = new FormData()
    ;["name", "city", "state", "country", "description", "bestTimeToVisit"].forEach((k) => {
      if (values[k]) formData.append(k, String(values[k]))
    })
    if (values.lat && values.lng) formData.append("coordinates", JSON.stringify({ lat: Number(values.lat), lng: Number(values.lng) }))
    formData.append("tags", JSON.stringify(String(values.tags || "").split(",").map((s) => s.trim()).filter(Boolean)))
    const files = values.gallery as FileList | null
    if (files) Array.from(files).forEach((f) => formData.append("gallery", f))

    if (editing) {
      await destinationApi.update(editing._id, formData)
      toast("Destination updated")
    } else {
      await destinationApi.create(formData)
      toast("Destination created")
    }
    load()
  }

  const handleDelete = async (d: Destination) => {
    if (!confirm(`Delete "${d.name}"?`)) return
    try {
      await destinationApi.remove(d._id)
      toast("Destination deleted")
      load()
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not delete destination", "error")
    }
  }

  const columns: AdminColumn<Destination>[] = [
    { key: "name", label: "Name" },
    { key: "city", label: "City", render: (d) => `${d.city}, ${d.state}` },
    { key: "tags", label: "Tags", render: (d) => d.tags.join(", ") },
  ]

  const initialValues = editing
    ? {
        name: editing.name,
        city: editing.city,
        state: editing.state,
        country: editing.country,
        description: editing.description,
        bestTimeToVisit: editing.bestTimeToVisit,
        tags: editing.tags.join(", "),
        lat: editing.coordinates?.lat,
        lng: editing.coordinates?.lng,
      }
    : { country: "India" }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Manage Destinations</h1>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }} className="bg-primary text-primary-foreground hover:bg-primary/90">+ Add Destination</Button>
      </div>

      <AdminTable
        columns={columns}
        rows={destinations}
        loading={loading}
        onEdit={(d) => { setEditing(d); setModalOpen(true) }}
        onDelete={handleDelete}
      />

      <AdminFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? "Edit Destination" : "Add Destination"}
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
