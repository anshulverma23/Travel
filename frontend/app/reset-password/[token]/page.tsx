"use client"

import { useState, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { authApi, setToken, ApiError } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    try {
      const { token: authToken } = await authApi.resetPassword(token, password)
      setToken(authToken)
      await refreshUser()
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "This reset link is invalid or has expired.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16 bg-muted/40">
        <Card className="w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground">Set a new password</h1>
          </div>

          {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="password" type="password" required minLength={6} className="pl-8" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Card>
      </main>
      <Footer />
    </>
  )
}
