'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Star, Loader2 } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

export default function RunningPage() {
  const { getProductsByCategory, loading } = useProducts()
  
  const products = useMemo(() => {
    return getProductsByCategory('Running')
  }, [getProductsByCategory])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E] pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-white">Running</span>
          </div>

          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Running <span className="text-[#D4AF37]">Collection</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Performance meets style in our running collection</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Loading running collection...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-3xl border border-white/10">
              <div className="text-6xl mb-4">🏃</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Running Products Yet</h3>
              <p className="text-gray-400 mb-6">Check back soon for our latest collection</p>
              <Link href="/" className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} className="group block">
                  <div className="bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/10">
                    <div className="relative aspect-square bg-black/20 overflow-hidden">
                      <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      {product.isNewArrival && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 text-[10px] font-extrabold tracking-[0.15em] uppercase rounded-full shadow-lg">NEW ARRIVAL</span>
                        </div>
                      )}
                      {product.isOnSale && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-1.5 text-[10px] font-extrabold tracking-[0.15em] uppercase rounded-full shadow-lg">ON SALE</span>
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <span className="text-white text-xl font-bold uppercase tracking-wider">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase font-bold mb-2">{product.category}</p>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < (product.rating || 0) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-gray-600 text-gray-600'} />
                        ))}
                        <span className="text-[11px] text-gray-400 ml-2">({product.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <p className="text-3xl font-bold text-[#D4AF37]">PKR {product.price.toLocaleString()}</p>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">View Details →</div>
                      </div>
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
