import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { blogPosts, getBlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/format"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: "Post Not Found" }
  return { title: `${post.title} | Incredible India Tours Blog`, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 bg-background">
        <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6 pb-8">
            <div className="flex gap-2 mb-3">
              {post.tags.map((t) => <Badge key={t} className="bg-white/15 text-white backdrop-blur-sm border-0">{t}</Badge>)}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">{post.title}</h1>
            <p className="mt-2 text-white/80 text-sm">{post.author} · {formatDate(post.date)}</p>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {post.content.map((para, i) => (
            <p key={i} className="mb-4 leading-relaxed text-foreground/90">{para}</p>
          ))}

          <Link href="/blog" className="mt-8 inline-block text-sm text-primary hover:underline">&larr; Back to all posts</Link>
        </article>
      </main>
      <Footer />
    </>
  )
}
