'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Star, Loader2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  isOnSale?: boolean
  isNewArrival?: boolean
  inStock?: boolean
}

export default function SneakersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=Sneakers')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

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
            <span className="text-white">Sneakers</span>
          </div>

          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Sneakers <span className="text-[#D4AF37]">Collection</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Premium sneakers crafted with exceptional attention to detail and comfort
            </p>
          </div>

          {/* Products Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{products.length}</span> Products
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Loading sneakers collection...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-3xl border border-white/10">
              <div className="text-6xl mb-4">👟</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Sneakers Available Yet</h3>
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
              {products.map((product, index) => (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="group block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/10">
                    <div className="relative aspect-square bg-black/20 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
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
                            className={i < product.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-gray-600 text-gray-600'}
                          />
                        ))}
                        <span className="text-[11px] text-gray-400 ml-2">
                          ({product.reviews} reviews)
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
              Why Choose <span className="text-[#D4AF37]">B&B Sneakers</span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                  <span className="text-4xl">👟</span>
                </div>
                <h3 className="text-white font-bold mb-2">Premium Quality</h3>
                <p className="text-gray-400 text-sm">Crafted with finest materials</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="text-white font-bold mb-2">Modern Design</h3>
                <p className="text-gray-400 text-sm">Contemporary & timeless styles</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="text-white font-bold mb-2">Perfect Fit</h3>
                <p className="text-gray-400 text-sm">Designed for ultimate comfort</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                  <span className="text-4xl">🔒</span>
                </div>
                <h3 className="text-white font-bold mb-2">Durability</h3>
                <p className="text-gray-400 text-sm">Built to last for years</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
