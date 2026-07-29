import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { blogPosts } from "@/lib/blog-data"
import { formatDate } from "@/lib/format"

export const metadata = {
  title: "Travel Blog | Incredible India Tours",
  description: "Travel tips, itineraries, and destination guides for exploring India.",
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-accent font-medium text-sm uppercase tracking-widest mb-2">Stories & Guides</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Travel Blog</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    {post.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
                  </div>
                  <h2 className="font-serif text-lg font-bold text-foreground line-clamp-2">{post.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{post.author} · {formatDate(post.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
