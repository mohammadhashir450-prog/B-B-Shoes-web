'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HoverSwapImage from '@/components/common/HoverSwapImage'
import { ChevronRight, Star, Sparkles, Loader2, Heart } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'
import { useWishlist } from '@/context/WishlistContext'

export default function ProductsPage() {
  const { allProducts, loading } = useProducts()
  const { isWishlisted, toggleWishlist } = useWishlist()

  // Get all regular products (not sales or new arrivals)
  const regularProducts = useMemo(() => {
    return allProducts.filter((p) => !p.isOnSale && !p.isNewArrival).sort((a, b) => a.name.localeCompare(b.name))
  }, [allProducts])

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
                {regularProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative bg-white border border-[#E7E0D1] rounded-2xl overflow-hidden transition-all duration-400 hover:border-[#D4AF37]/45 hover:shadow-[0_18px_34px_-18px_rgba(24,32,43,0.22)]"
                  >
                    <Link href={`/product/${product.id}`} className="h-full flex flex-col">
                      {/* Image Section */}
                      <div className="relative h-[195px] sm:h-[230px] lg:h-[245px] bg-[#FAF9F7] overflow-hidden rounded-xl border border-[#06080F]/45 shadow-[0_12px_24px_-18px_rgba(6,8,15,0.5)] transition-all duration-400 group-hover:border-[#06080F]/70 m-3">
                        <HoverSwapImage
                          primaryImage={product.image}
                          secondaryImage={product.secondaryImage}
                          alt={product.name}
                          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 45vw, 340px"
                          fitClassName="object-cover object-center group-hover:scale-105 transition-transform duration-600 ease-out"
                        />

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleWishlist(product.id)
                          }}
                          className={`absolute top-6 right-6 w-9 h-9 backdrop-blur-md border rounded-full flex items-center justify-center transition-all duration-300 z-20 ${
                            isWishlisted(product.id)
                              ? 'bg-[#FDECEC] border-red-300 text-red-500'
                              : 'bg-[#F9F8F6]/85 border-[#E0D4BF] text-[#4F5A69] hover:text-red-500 hover:bg-[#F9F8F6] hover:border-red-300'
                          }`}
                        >
                          <Heart size={16} strokeWidth={2} className={isWishlisted(product.id) ? 'fill-red-500' : ''} />
                        </button>
                      </div>

                      {/* Product Info Section */}
                      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow justify-between border-t border-[#ECE7DD] bg-white">
                        <div>
                          <p className="text-[#A97A18] text-[9px] tracking-[0.2em] uppercase mb-2 font-bold">
                            {product.brand || 'B&B EXCLUSIVE'}
                          </p>
                          <h3 className="text-base sm:text-lg font-serif font-bold text-[#18202B] leading-tight mb-2 group-hover:text-[#A97A18] transition-colors line-clamp-2 min-h-[46px] sm:min-h-[52px]">
                            {product.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <p className="text-base font-bold text-[#D4AF37]">
                              PKR {product.price.toLocaleString()}
                            </p>
                            {product.originalPrice && product.originalPrice > product.price ? (
                              <p className="text-xs text-[#6A7483] line-through">
                                PKR {product.originalPrice.toLocaleString()}
                              </p>
                            ) : null}
                          </div>

                          <span className="text-[10px] tracking-[0.14em] uppercase font-bold text-[#4F5A69]">
                            View
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
