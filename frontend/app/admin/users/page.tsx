"use client"

import { useEffect, useState } from "react"
import { ShieldCheck, UserX, UserCheck } from "lucide-react"
import { AdminTable, type AdminColumn } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { useToast } from "@/context/toast-context"
import { userApi, ApiError } from "@/lib/api"
import type { User } from "@/lib/types"

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const load = () => {
    setLoading(true)
    userApi
      .adminList({ search, limit: 50 })
      .then((res) => setUsers((res.users as User[]) || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const toggleActive = async (user: User) => {
    try {
      await userApi.update(user._id, { isActive: !user.isActive })
      toast(user.isActive ? "User deactivated" : "User activated")
      load()
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not update user", "error")
    }
  }

  const toggleRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin"
    if (!confirm(`Make ${user.name} ${newRole === "admin" ? "an admin" : "a regular user"}?`)) return
    try {
      await userApi.update(user._id, { role: newRole })
      toast("Role updated")
      load()
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not update role", "error")
    }
  }

  const deleteUser = async (user: User) => {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return
    try {
      await userApi.remove(user._id)
      toast("User deleted")
      load()
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not delete user", "error")
    }
  }

  const columns: AdminColumn<User>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (u) => <Badge className={u.role === "admin" ? "bg-primary/10 text-primary" : ""} variant={u.role === "admin" ? "default" : "outline"}>{u.role}</Badge> },
    { key: "status", label: "Status", render: (u) => <Badge variant={u.isActive === false ? "destructive" : "outline"}>{u.isActive === false ? "Inactive" : "Active"}</Badge> },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Manage Users</h1>
        <div className="w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search users..." /></div>
      </div>

      <AdminTable
        columns={columns}
        rows={users}
        loading={loading}
        onDelete={deleteUser}
        extraAction={(u) => (
          <>
            <Button variant="ghost" size="icon-sm" onClick={() => toggleRole(u)} aria-label="Toggle admin role" title="Toggle admin role">
              <ShieldCheck className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => toggleActive(u)} aria-label="Toggle active" title="Activate/Deactivate">
              {u.isActive === false ? <UserCheck className="size-3.5" /> : <UserX className="size-3.5" />}
            </Button>
          </>
        )}
      />
    </div>
  )
}
