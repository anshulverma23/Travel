import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FAQ } from "@/components/faq"

export const metadata = {
  title: "Frequently Asked Questions | Incredible India Tours",
  description: "Answers to common questions about traveling in India, visas, best time to visit, and booking with us.",
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
