'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Star, Filter, Loader2 } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

export default function MenPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { menProducts, loading } = useProducts()

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return menProducts
    
    return menProducts.filter(product => 
      product.name?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      product.description?.toLowerCase().includes(selectedCategory.toLowerCase())
    )
  }, [menProducts, selectedCategory])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E] pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-white">Men&apos;s Collection</span>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold mb-4">
              GENTLEMAN&apos;S CHOICE
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Men&apos;s <span className="text-[#D4AF37]">Premium</span> Collection
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Handcrafted excellence designed for the modern gentleman who values timeless sophistication
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-[#D4AF37]" />
              <div className="flex gap-2 flex-wrap">
                {['all', 'formal', 'casual', 'boots', 'loafers'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#D4AF37] text-[#0B101E]'
                        : 'bg-[#1A2435] text-white hover:bg-[#243048]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{filteredProducts.length}</span> Products
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">👔</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Men&apos;s Products Yet</h3>
              <p className="text-gray-400 mb-8">New arrivals coming soon!</p>
              <Link 
                href="/" 
                className="inline-block bg-[#D4AF37] text-[#0B101E] px-8 py-3 rounded-lg font-bold hover:bg-[#C19B2C] transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}

          {/* Products Grid */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-[#1A2435] rounded-xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-all group block"
                >
                  <div className="relative aspect-square bg-black/20">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {product.isNewArrival && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-green-600 text-white px-3 py-1 text-[9px] font-extrabold tracking-[0.15em] uppercase rounded">
                          NEW ARRIVAL
                        </span>
                      </div>
                    )}
                    {product.isOnSale && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 text-[9px] font-extrabold tracking-[0.15em] uppercase rounded">
                          ON SALE
                        </span>
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A2435] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <p className="text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase font-bold mb-2">
                      {product.category}
                    </p>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < (product.rating || 0) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-gray-600 text-gray-600'}
                        />
                      ))}
                      <span className="text-[11px] text-gray-400 ml-2">
                        ({product.reviews || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold text-[#D4AF37]">
                        PKR {product.price.toLocaleString()}
                      </p>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Features Banner */}
          <div className="grid md:grid-cols-3 gap-6 bg-[#1A2435] rounded-2xl p-8 border border-white/5">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-white font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-400 text-sm">100% hand-stitched Italian leather</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-white font-bold mb-2">Lifetime Warranty</h3>
              <p className="text-gray-400 text-sm">Craftsmanship guaranteed forever</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-white font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-400 text-sm">White glove delivery worldwide</p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}