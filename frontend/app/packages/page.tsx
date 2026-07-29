"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { FilterSidebar, FilterGroup } from "@/components/filter-sidebar"
import { PackageCard } from "@/components/package-card"
import { Pagination } from "@/components/pagination"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PageLoader } from "@/components/ui/spinner"
import { packageApi } from "@/lib/api"
import type { TourPackage } from "@/lib/types"

const PACKAGE_TYPES = ["Adventure", "Luxury", "Family", "Honeymoon", "Pilgrimage", "Wildlife", "Cultural"]

export default function PackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [search, setSearch] = useState("")
  const [packageType, setPackageType] = useState("")
  const [duration, setDuration] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  useEffect(() => {
    let ignore = false
    setLoading(true)
    packageApi
      .list({ search, packageType, duration, minPrice, maxPrice, page, limit: 9 })
      .then((res) => {
        if (ignore) return
        setPackages((res.packages as TourPackage[]) || [])
        setPages(res.pages || 1)
      })
      .catch(() => !ignore && setPackages([]))
      .finally(() => !ignore && setLoading(false))
    return () => {
      ignore = true
    }
  }, [search, packageType, duration, minPrice, maxPrice, page])

  const clearFilters = () => {
    setPackageType("")
    setDuration("")
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
            <p className="text-accent font-medium text-sm uppercase tracking-widest mb-2">Curated Journeys</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Tour Packages</h1>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search packages..." />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <FilterSidebar onClear={clearFilters}>
              <FilterGroup label="Package Type">
                <Select value={packageType} onChange={(e) => { setPackageType(e.target.value); setPage(1) }}>
                  <option value="">Any type</option>
                  {PACKAGE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </FilterGroup>
              <FilterGroup label="Duration (days)">
                <Input type="number" placeholder="e.g. 6" value={duration} onChange={(e) => { setDuration(e.target.value); setPage(1) }} />
              </FilterGroup>
              <FilterGroup label="Price per person (₹)">
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1) }} />
                  <span className="text-muted-foreground">-</span>
                  <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }} />
                </div>
              </FilterGroup>
            </FilterSidebar>

            <div className="flex-1">
              {loading ? (
                <PageLoader label="Finding packages..." />
              ) : packages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border py-20 text-center text-muted-foreground">
                  No packages found. Try adjusting your filters.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                      <PackageCard key={pkg._id} pkg={pkg} />
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
