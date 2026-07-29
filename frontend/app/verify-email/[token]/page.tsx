"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageLoader } from "@/components/ui/spinner"
import { authApi, ApiError } from "@/lib/api"

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    authApi
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error")
        setMessage(err instanceof ApiError ? err.message : "Verification failed")
      })
  }, [token])

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 pt-32 pb-16 bg-muted/40">
        {status === "loading" ? (
          <PageLoader label="Verifying your email..." />
        ) : (
          <Card className="w-full max-w-md p-8 text-center">
            {status === "success" ? (
              <>
                <CheckCircle2 className="mx-auto mb-4 size-12 text-primary" />
                <h1 className="font-serif text-2xl font-bold text-foreground">Email verified!</h1>
                <p className="mt-2 text-sm text-muted-foreground">Your account is ready to go.</p>
              </>
            ) : (
              <>
                <XCircle className="mx-auto mb-4 size-12 text-destructive" />
                <h1 className="font-serif text-2xl font-bold text-foreground">Verification failed</h1>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
              </>
            )}
            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90" render={<Link href="/dashboard" />}>
              Go to Dashboard
            </Button>
          </Card>
        )}
      </main>
      <Footer />
    </>
  )
}
