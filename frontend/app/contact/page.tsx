"use client"

import { useState, type FormEvent } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { contactApi, ApiError } from "@/lib/api"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    setErrorMsg("")
    try {
      await contactApi.send(form)
      setStatus("sent")
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof ApiError ? err.message : "Could not send your message. Please try again.")
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-accent font-medium text-sm uppercase tracking-widest mb-2">Get in Touch</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Contact Us</h1>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Questions about a booking, or planning something custom? We&apos;d love to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Card className="p-5 flex items-start gap-3">
                <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Email</p>
                  <p className="text-sm text-muted-foreground">support@indiatravel.com</p>
                </div>
              </Card>
              <Card className="p-5 flex items-start gap-3">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Phone</p>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                </div>
              </Card>
              <Card className="p-5 flex items-start gap-3">
                <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Office</p>
                  <p className="text-sm text-muted-foreground">Connaught Place, New Delhi, India</p>
                </div>
              </Card>
            </div>

            <Card className="md:col-span-3 p-6">
              {status === "sent" ? (
                <Alert variant="success">Thanks for reaching out! We&apos;ll get back to you within 24 hours.</Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === "error" && <Alert variant="destructive">{errorMsg}</Alert>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" required value={form.name} onChange={update("name")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={form.email} onChange={update("email")} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={form.subject} onChange={update("subject")} placeholder="How can we help?" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" required rows={5} value={form.message} onChange={update("message")} />
                  </div>
                  <Button type="submit" disabled={status === "sending"} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Send className="size-4 mr-2" /> {status === "sending" ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
