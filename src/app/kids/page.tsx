'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Loader2 } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

export default function KidsPage() {
  const { getProductsByCategory, loading } = useProducts()
  
  const products = useMemo(() => {
    return getProductsByCategory('Kids')
  }, [getProductsByCategory])

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
            <span className="text-white">Kids Collection</span>
          </div>

          {/* Hero Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold mb-4">
                YOUNG EXPLORERS
              </p>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                Premium <span className="text-[#D4AF37]">Kids</span> Collection
              </h1>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Comfort and style for the next generation. Our kids collection combines durability with the premium craftsmanship B&B is known for.
              </p>
            </div>
          </div>

          {/* Kids Products */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Featured <span className="text-[#D4AF37]">Styles</span>
            </h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
                <p className="text-gray-400 text-sm">Loading kids collection...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-3xl border border-white/10">
                <div className="text-6xl mb-4">👟</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Kids Products Yet</h3>
                <p className="text-gray-400 mb-6">Check back soon for our kids collection</p>
                <Link 
                  href="/"
                  className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className="group">
                    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-300">
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <Image
                          src={product.image || '/images/placeholder.jpg'}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={product.image?.includes('cloudinary')}
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="text-white font-bold text-lg uppercase">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-gray-900 font-bold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[#D4AF37] font-bold text-lg">PKR {product.price.toLocaleString()}</p>
                            {product.originalPrice && product.originalPrice > product.price ? (
                              <p className="text-gray-500 text-xs line-through mt-1">PKR {product.originalPrice.toLocaleString()}</p>
                            ) : null}
                          </div>
                          {product.isOnSale && (
                            <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">Sale</span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
