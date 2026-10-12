'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/common/ProductCard'
import { ChevronRight, Star, Sparkles, Loader2, Heart } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'
import { useWishlist } from '@/context/WishlistContext'

export default function ProductsPage() {
  const { allProducts, loading } = useProducts()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  // Get all regular products (not sales or new arrivals)
  const regularProducts = useMemo(() => {
    return allProducts.filter((p) => !p.isOnSale && !p.isNewArrival).sort((a, b) => a.name.localeCompare(b.name))
  }, [allProducts])

  const totalPages = Math.max(1, Math.ceil(regularProducts.length / productsPerPage))
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage
    return regularProducts.slice(startIndex, startIndex + productsPerPage)
  }, [regularProducts, currentPage])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Premium Loading State
  if (loading) {
    return (
      <>
        <Navbar />
        <section className="relative bg-white min-h-screen py-32 overflow-hidden flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="w-12 h-12 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">
              Curating Collection
            </p>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FCFBF8]">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#FCFBF8] to-white py-8 md:py-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/" className="text-[#4F5A69] hover:text-[#D4AF37] transition-colors">
                Home
              </Link>
              <ChevronRight size={16} className="text-[#DCCFB6]" />
              <span className="text-[#D4AF37] font-bold">All Products</span>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
                <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2">
                  <Sparkles size={12} /> Complete Collection
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-[#18202B] leading-tight mb-3">
                All Products
              </h1>
              <p className="text-[#4F5A69] text-base max-w-[520px] leading-relaxed">
                Explore our complete collection of premium shoes, each carefully selected for quality, comfort, and style.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-[#D4AF37] font-bold">{regularProducts.length}</span>
              <span className="text-[#4F5A69]">Premium Products</span>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
            {regularProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-white/5 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 shadow-2xl">
                  <Sparkles className="w-10 h-10 text-[#4F5A69]" strokeWidth={1} />
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#18202B] mb-4">No Products Yet</h3>
                <p className="text-[#4F5A69] text-sm max-w-lg text-center">
                  Our artisans are currently crafting new pieces. Please check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} priority={index < 3} />
                ))}
              </div>
            )}

            {regularProducts.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-[#D7C9AD] flex items-center justify-center text-[#233044] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>

                <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#0B101E] font-bold text-sm flex items-center justify-center">
                  {currentPage}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-[#D7C9AD] flex items-center justify-center text-[#233044] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
