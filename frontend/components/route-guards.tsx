"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { PageLoader } from "@/components/ui/spinner"

/** Redirects to /login if not authenticated. Renders children once a user is confirmed. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, user, router])

  if (loading || !user) return <PageLoader label="Checking your session..." />
  return <>{children}</>
}

/** Redirects non-admins away. Renders children once an admin user is confirmed. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.replace("/login")
  }, [loading, user, router])

  if (loading || !user || user.role !== "admin") return <PageLoader label="Checking admin access..." />
  return <>{children}</>
}
