"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/context/toast-context"
import { wishlistApi, ApiError } from "@/lib/api"

export function WishlistButton({ itemType, itemId }: { itemType: "Hotel" | "Package"; itemId: string }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [inWishlist, setInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    wishlistApi
      .get()
      .then(({ wishlist }) => {
        setInWishlist(wishlist.items.some((i) => i.itemType === itemType && (i.item as { _id: string })._id === itemId))
      })
      .catch(() => {})
  }, [user, itemType, itemId])

  const toggle = async () => {
    if (!user) {
      router.push("/login")
      return
    }
    setLoading(true)
    try {
      if (inWishlist) {
        await wishlistApi.remove(itemId)
        setInWishlist(false)
        toast("Removed from wishlist")
      } else {
        await wishlistApi.add(itemType, itemId)
        setInWishlist(true)
        toast("Added to wishlist")
      }
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur-sm transition-colors hover:border-primary",
        inWishlist && "border-primary bg-primary/10"
      )}
    >
      <Heart className={cn("size-4.5", inWishlist ? "fill-primary text-primary" : "text-foreground")} />
    </button>
  )
}
