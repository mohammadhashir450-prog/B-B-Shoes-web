'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Star, Award, Users, Globe, Loader2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description?: string
  rating: number
  reviews: number
  isOnSale?: boolean
  isNewArrival?: boolean
  inStock?: boolean
}

export default function HeritagePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=Heritage')
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
            <span className="text-white">Heritage Collection</span>
          </div>

          {/* Hero Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-1 h-12 bg-[#D4AF37]"></div>
                <div>
                  <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold">
                    EST. 1924
                  </p>
                  <p className="text-gray-400 text-xs">A Century of Excellence</p>
                </div>
                <div className="w-1 h-12 bg-[#D4AF37]"></div>
              </div>
              <h1 className="text-6xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
                The Heritage<br/>
                <span className="text-[#D4AF37]">Collection</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Each piece in our Heritage Collection represents a defining moment in our century-long journey. 
                These are not merely shoes—they are wearable history, meticulously recreated from our archives.
              </p>
            </div>

            {/* Timeline Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-[#1A2435] rounded-2xl p-6 text-center border border-white/5">
                <p className="text-5xl font-bold text-[#D4AF37] mb-2">100+</p>
                <p className="text-gray-400 text-sm uppercase tracking-wider">Years Legacy</p>
              </div>
              <div className="bg-[#1A2435] rounded-2xl p-6 text-center border border-white/5">
                <p className="text-5xl font-bold text-[#D4AF37] mb-2">4</p>
                <p className="text-gray-400 text-sm uppercase tracking-wider">Generations</p>
              </div>
              <div className="bg-[#1A2435] rounded-2xl p-6 text-center border border-white/5">
                <p className="text-5xl font-bold text-[#D4AF37] mb-2">50K+</p>
                <p className="text-gray-400 text-sm uppercase tracking-wider">Master Pairs</p>
              </div>
              <div className="bg-[#1A2435] rounded-2xl p-6 text-center border border-white/5">
                <p className="text-5xl font-bold text-[#D4AF37] mb-2">180</p>
                <p className="text-gray-400 text-sm uppercase tracking-wider">Hours/Pair</p>
              </div>
            </div>
          </div>

          {/* Heritage Products */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Iconic <span className="text-[#D4AF37]">Masterpieces</span>
            </h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
                <p className="text-gray-400 text-sm">Loading heritage collection...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-3xl border border-white/10">
                <div className="text-6xl mb-4">🏛️</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Heritage Products Yet</h3>
                <p className="text-gray-400 mb-6">Check back soon for our legendary collection</p>
                <Link 
                  href="/"
                  className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-10">
                {products.map((product) => (
                  <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="bg-gradient-to-br from-[#1A2435] via-[#1A2435] to-[#0F1825] rounded-3xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-500 group block"
                  >
                    <div className="relative aspect-[4/3] bg-black/30 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {product.isNewArrival && (
                        <div className="absolute top-6 left-6">
                          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-xs font-bold uppercase rounded-full shadow-lg">
                            NEW ARRIVAL
                          </span>
                        </div>
                      )}
                      {product.isOnSale && (
                        <div className="absolute top-6 right-6">
                          <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 text-xs font-bold uppercase rounded-full shadow-lg">
                            ON SALE
                          </span>
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold uppercase tracking-wider">Out of Stock</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2435] via-transparent to-transparent"></div>
                    </div>

                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-6">
                        <Award size={16} className="text-[#D4AF37]" />
                        <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
                          Heritage Collection
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Investment Price</p>
                          <p className="text-4xl font-bold text-[#D4AF37]">
                            PKR {product.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">
                          View Details →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Heritage Story */}
          <div className="bg-gradient-to-r from-[#1A2435] to-[#0F1825] rounded-3xl p-12 md:p-16 border border-white/10 mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  A Century of<br/>
                  <span className="text-[#D4AF37]">Quiet Luxury</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Since 1924, the Bianchi & Berluti families have preserved the dying art of traditional Italian shoemaking. 
                  Every Heritage piece undergoes the same 180-hour process our founders perfected a century ago.
                </p>
                <p className="text-gray-400 leading-relaxed mb-8">
                  From selecting hides to the final hand-polish, we refuse to compromise. This isn't fast fashion—
                  this is generational craftsmanship designed to outlive trends and be treasured for decades.
                </p>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-3xl font-bold text-[#D4AF37] mb-1">4</p>
                    <p className="text-gray-500 text-xs uppercase">Generations</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#D4AF37] mb-1">25</p>
                    <p className="text-gray-500 text-xs uppercase">Master Artisans</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#D4AF37] mb-1">100%</p>
                    <p className="text-gray-500 text-xs uppercase">Handcrafted</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
                  alt="Craftsmanship"
                  fill
                  className="object-cover grayscale"
                />
                <div className="absolute bottom-8 right-8 w-32 h-32 bg-[#0B101E] border-4 border-[#D4AF37] rounded-full flex flex-col items-center justify-center">
                  <span className="text-[#D4AF37] text-xs tracking-widest">EST.</span>
                  <span className="text-[#D4AF37] text-3xl font-bold">1924</span>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-[#1A2435] rounded-2xl p-8 border border-white/5">
              <Users size={48} className="text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-3">Family Tradition</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Four generations of master craftsmen keeping traditions alive
              </p>
            </div>
            <div className="text-center bg-[#1A2435] rounded-2xl p-8 border border-white/5">
              <Globe size={48} className="text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-3">Global Legacy</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Worn by royalty, leaders, and connoisseurs worldwide
              </p>
            </div>
            <div className="text-center bg-[#1A2435] rounded-2xl p-8 border border-white/5">
              <Award size={48} className="text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-3">Timeless Quality</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Designed to be treasured and passed down through generations
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
