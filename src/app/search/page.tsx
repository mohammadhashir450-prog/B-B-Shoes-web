'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useProducts } from '@/context/ProductContext'

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { allProducts, loading } = useProducts()

  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []

    return allProducts.filter((product) => {
      const name = product.name?.toLowerCase() || ''
      const description = product.description?.toLowerCase() || ''
      const category = product.category?.toLowerCase() || ''
      const brand = product.brand?.toLowerCase() || ''

      return (
        name.includes(trimmed) ||
        description.includes(trimmed) ||
        category.includes(trimmed) ||
        brand.includes(trimmed)
      )
    })
  }, [allProducts, query])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      router.push('/search')
      return
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E] pt-28 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-6">Search Products</h1>

          <form onSubmit={onSubmit} className="relative mb-10">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand, category..."
              className="w-full rounded-full bg-[#121A2F] border border-white/10 text-white placeholder:text-white/35 pl-12 pr-24 py-3.5 outline-none focus:border-[#D4AF37]/60"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37] text-[#0B101E] px-5 py-2 text-xs font-bold tracking-[0.12em] uppercase hover:bg-[#F4CE5C] transition-colors"
            >
              Find
            </button>
          </form>

          {!query.trim() && (
            <p className="text-white/60 text-sm">Start typing to find your next pair.</p>
          )}

          {loading && query.trim() && (
            <p className="text-white/60 text-sm">Loading products...</p>
          )}

          {!loading && query.trim() && (
            <p className="text-white/60 text-sm mb-5">
              {results.length} result{results.length === 1 ? '' : 's'} for &quot;{query.trim()}&quot;
            </p>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="bg-[#121A2F]/70 border border-white/10 rounded-2xl p-8 text-center text-white/70">
              No products found. Try a different keyword.
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-[#121A2F]/70 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 transition-colors"
                >
                  <div className="relative aspect-[4/5] bg-[#0F1628]">
                    <Image
                      src={product.image || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized={product.image?.includes('cloudinary')}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[#D4AF37] text-[10px] tracking-[0.15em] uppercase mb-2">{product.brand || 'B&B'}</p>
                    <h2 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h2>
                    <div className="flex items-center justify-between">
                      <p className="text-white/90 text-sm">PKR {product.price.toLocaleString()}</p>
                      <ArrowRight size={14} className="text-white/40 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="min-h-screen bg-[#0B101E] pt-28 pb-16">
            <div className="max-w-[1200px] mx-auto px-6 md:px-10">
              <p className="text-white/60 text-sm">Loading search...</p>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
