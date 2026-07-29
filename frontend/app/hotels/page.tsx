"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { FilterSidebar, FilterGroup } from "@/components/filter-sidebar"
import { HotelCard } from "@/components/hotel-card"
import { Pagination } from "@/components/pagination"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PageLoader } from "@/components/ui/spinner"
import { hotelApi } from "@/lib/api"
import type { Hotel } from "@/lib/types"

const HOTEL_TYPES = ["Budget", "Standard", "Luxury", "Resort", "Boutique", "Heritage"]

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [search, setSearch] = useState("")
  const [city, setCity] = useState("")
  const [hotelType, setHotelType] = useState("")
  const [rating, setRating] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  useEffect(() => {
    let ignore = false
    setLoading(true)
    hotelApi
      .list({ search, city, hotelType, rating, minPrice, maxPrice, page, limit: 9 })
      .then((res) => {
        if (ignore) return
        setHotels((res.hotels as Hotel[]) || [])
        setPages(res.pages || 1)
      })
      .catch(() => !ignore && setHotels([]))
      .finally(() => !ignore && setLoading(false))
    return () => {
      ignore = true
    }
  }, [search, city, hotelType, rating, minPrice, maxPrice, page])

  const clearFilters = () => {
    setCity("")
    setHotelType("")
    setRating("")
    setMinPrice("")
    setMaxPrice("")
    setPage(1)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-accent font-medium text-sm uppercase tracking-widest mb-2">Stay in Style</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Find Your Hotel</h1>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by hotel name, city..." />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <FilterSidebar onClear={clearFilters}>
              <FilterGroup label="City">
                <Input value={city} onChange={(e) => { setCity(e.target.value); setPage(1) }} placeholder="e.g. Jaipur" />
              </FilterGroup>
              <FilterGroup label="Hotel Type">
                <Select value={hotelType} onChange={(e) => { setHotelType(e.target.value); setPage(1) }}>
                  <option value="">Any type</option>
                  {HOTEL_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </FilterGroup>
              <FilterGroup label="Minimum Rating">
                <Select value={rating} onChange={(e) => { setRating(e.target.value); setPage(1) }}>
                  <option value="">Any rating</option>
                  {[4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r}+ stars</option>
                  ))}
                </Select>
              </FilterGroup>
              <FilterGroup label="Price per night (₹)">
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1) }} />
                  <span className="text-muted-foreground">-</span>
                  <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }} />
                </div>
              </FilterGroup>
            </FilterSidebar>

            <div className="flex-1">
              {loading ? (
                <PageLoader label="Finding hotels..." />
              ) : hotels.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
                  No hotels found. Try adjusting your filters.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                      <HotelCard key={hotel._id} hotel={hotel} />
                    ))}
                  </div>
                  <Pagination page={page} pages={pages} onChange={setPage} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
