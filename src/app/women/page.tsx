'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Star, Sparkles, Loader2 } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

export default function WomenPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState('all')
  const { womenProducts, loading } = useProducts()

  // Filter products based on selected style
  const filteredProducts = useMemo(() => {
    if (selectedStyle === 'all') return womenProducts
    
    return womenProducts.filter(product => 
      product.name?.toLowerCase().includes(selectedStyle.toLowerCase()) ||
      product.description?.toLowerCase().includes(selectedStyle.toLowerCase())
    )
  }, [womenProducts, selectedStyle])

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
            <span className="text-white">Women&apos;s Collection</span>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={20} className="text-[#D4AF37]" />
              <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold">
                FEMININE ELEGANCE
              </p>
              <Sparkles size={20} className="text-[#D4AF37]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Women&apos;s <span className="text-[#D4AF37]">Luxury</span> Collection
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Where artistry meets comfort. Each piece crafted to celebrate feminine grace and sophistication
            </p>
          </div>

          {/* Style Filter */}
          <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
            {['all', 'heels', 'flats', 'boots', 'wedges', 'loafers', 'slippers'].map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedStyle === style
                    ? 'bg-[#D4AF37] text-[#0B101E] shadow-lg shadow-[#D4AF37]/20'
                    : 'bg-[#1A2435] text-white hover:bg-[#243048] border border-white/10'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Loading women&apos;s collection...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-3xl border border-white/10">
              <div className="text-6xl mb-4">👠</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Women&apos;s Products Yet</h3>
              <p className="text-gray-400 mb-6">Check back soon for our latest collection</p>
              <Link 
                href="/"
                className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredProducts.map((product, index) => (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="group block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/10">
                    <div className="relative aspect-square bg-black/20 overflow-hidden">
                      <Image
                        src={product.image || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        unoptimized={product.image?.includes('cloudinary')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.jpg';
                        }}
                      />
                      {product.isNewArrival && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 text-[10px] font-extrabold tracking-[0.15em] uppercase rounded-full shadow-lg">
                            NEW ARRIVAL
                          </span>
                        </div>
                      )}
                      {product.isOnSale && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-1.5 text-[10px] font-extrabold tracking-[0.15em] uppercase rounded-full shadow-lg">
                            ON SALE
                          </span>
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <span className="text-white text-xl font-bold uppercase tracking-wider">Out of Stock</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B101E] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                    </div>

                    <div className="p-6">
                      <p className="text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase font-bold mb-2">
                        {product.category}
                      </p>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
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
                          ({product.reviews || 0} reviews)
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <p className="text-3xl font-bold text-[#D4AF37]">
                          PKR {product.price.toLocaleString()}
                        </p>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Features Section */}
          <div className="bg-gradient-to-r from-[#1A2435] to-[#243048] rounded-3xl p-12 border border-white/10">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              The <span className="text-[#D4AF37]">B&B Shoes</span> Promise
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-white font-bold mb-2">Luxury Materials</h3>
                <p className="text-gray-400 text-sm">Premium Italian & French leather</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="text-white font-bold mb-2">Handcrafted</h3>
                <p className="text-gray-400 text-sm">180 hours per pair</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                  <span className="text-4xl">🎁</span>
                </div>
                <h3 className="text-white font-bold mb-2">Luxury Packaging</h3>
                <p className="text-gray-400 text-sm">Signature gift box included</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                  <span className="text-4xl">♾️</span>
                </div>
                <h3 className="text-white font-bold mb-2">Lifetime Care</h3>
                <p className="text-gray-400 text-sm">Complimentary repairs</p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}