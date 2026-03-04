'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, ChevronDown, Star, Loader2 } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

const sizes = [7, 8, 9, 10, 11, 12, 13]

export default function NewArrivals() {
  const { getNewArrivals, loading } = useProducts()
  const [selectedSize, setSelectedSize] = useState<number | null>(9)
  const [priceRangeOpen, setPriceRangeOpen] = useState(false)
  const [materialOpen, setMaterialOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('new-arrivals')
  
  const products = useMemo(() => {
    return getNewArrivals()
  }, [getNewArrivals])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E] pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          
          {/* Breadcrumb & Sort */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                Home
              </Link>
              <ChevronRight size={14} className="text-gray-500" />
              <span className="text-white">Advanced Shop</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs uppercase tracking-wider">SORT BY:</span>
              <button className="bg-[#1A2435] text-white px-4 py-2 rounded text-xs font-medium hover:bg-[#243048] transition-colors">
                Exclusively: High to Low
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px,1fr] gap-8">
            
            {/* Left Sidebar */}
            <aside className="space-y-6">
              
              {/* Curation Header */}
              <div className="mb-6">
                <p className="text-[#D4AF37] text-[9px] tracking-[0.25em] uppercase font-bold mb-2">
                  CURATION
                </p>
                <h1 className="text-white text-2xl font-bold">Premium Gallery</h1>
              </div>

              {/* Categories */}
              <div className="space-y-1">
                <button 
                  onClick={() => setActiveCategory('new-arrivals')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-all ${
                    activeCategory === 'new-arrivals' 
                      ? 'bg-[#D4AF37] text-[#0B101E]' 
                      : 'bg-[#1A2435] text-white hover:bg-[#243048]'
                  }`}
                >
                  <span className="text-sm font-bold">✨ New Arrivals</span>
                </button>
                
                <button 
                  onClick={() => setActiveCategory('oxford')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-all ${
                    activeCategory === 'oxford' 
                      ? 'bg-[#D4AF37] text-[#0B101E]' 
                      : 'bg-transparent text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm">👞 Oxford Series</span>
                </button>
                
                <button 
                  onClick={() => setActiveCategory('loafers')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-all ${
                    activeCategory === 'loafers' 
                      ? 'bg-[#D4AF37] text-[#0B101E]' 
                      : 'bg-transparent text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm">🥿 Loafers</span>
                </button>
                
                <button 
                  onClick={() => setActiveCategory('sneakers')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-all ${
                    activeCategory === 'sneakers' 
                      ? 'bg-[#D4AF37] text-[#0B101E]' 
                      : 'bg-transparent text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm">👟 Sneakers</span>
                </button>
              </div>

              {/* Size Filter */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-sm font-bold uppercase tracking-wider">SIZE</h3>
                  <ChevronDown size={16} className="text-[#D4AF37]" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-[#D4AF37] text-[#0B101E]'
                          : 'bg-[#1A2435] text-white hover:bg-[#243048]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pt-4">
                <button 
                  onClick={() => setPriceRangeOpen(!priceRangeOpen)}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="text-white text-sm font-bold uppercase tracking-wider">PRICE RANGE</h3>
                  <ChevronDown 
                    size={16} 
                    className={`text-[#D4AF37] transition-transform ${priceRangeOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                {priceRangeOpen && (
                  <div className="space-y-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      className="w-full accent-[#D4AF37]"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>$0</span>
                      <span>$2,000</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Material Filter */}
              <div className="pt-4">
                <button 
                  onClick={() => setMaterialOpen(!materialOpen)}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="text-white text-sm font-bold uppercase tracking-wider">MATERIAL</h3>
                  <ChevronDown 
                    size={16} 
                    className={`text-[#D4AF37] transition-transform ${materialOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                {materialOpen && (
                  <div className="space-y-2 text-sm text-white">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#D4AF37]" />
                      <span>Full grain leather</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#D4AF37]" />
                      <span>Suede</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#D4AF37]" />
                      <span>Patent leather</span>
                    </label>
                  </div>
                )}
              </div>
              
            </aside>

            {/* Product Grid */}
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-10 h-10 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">No New Arrivals Yet</h2>
                  <p className="text-gray-400 mb-8">Check back soon for exciting new products!</p>
                  <Link
                    href="/"
                    className="inline-block bg-[#D4AF37] hover:bg-[#F4CE5C] text-[#0B101E] font-bold py-3 px-8 rounded-full transition-all"
                  >
                    Back to Home
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                    {products.map((product) => (
                      <Link 
                        href={`/product/${product.id}`}
                        key={product.id} 
                        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group block"
                      >
                        <div className="relative aspect-square bg-gray-50">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-green-600 text-white px-3 py-1 text-[9px] font-extrabold tracking-[0.15em] uppercase">
                              NEW ARRIVAL
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <p className="text-gray-500 text-[9px] tracking-[0.2em] uppercase font-semibold mb-1">
                            {product.brand}
                          </p>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-2">
                            {product.description || 'Premium quality footwear'}
                          </p>
                          
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < (product.rating || 0) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-gray-300 text-gray-300'}
                              />
                            ))}
                            <span className="text-[10px] text-gray-500 ml-1">
                              ({product.reviews || 0} REVIEWS)
                            </span>
                          </div>
                          
                          <p className="text-2xl font-bold text-[#D4AF37] mb-4">
                            PKR {product.price.toLocaleString()}
                          </p>
                          
                          <div className="w-full bg-[#0B101E] text-white py-3 rounded text-xs font-bold tracking-[0.15em] uppercase text-center">
                            VIEW DETAILS →
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-2">
                    <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
                      <ChevronRight size={16} className="rotate-180" />
                    </button>
                    
                    <button className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#0B101E] font-bold text-sm">
                      1
                    </button>
                    
                    <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
                      <ChevronRight size={16} />
                    </button>
                  </div>
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
