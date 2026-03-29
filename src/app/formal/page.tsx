'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HoverSwapImage from '@/components/common/HoverSwapImage'
import { ChevronRight, Star, Loader2, Award, Shield, Sparkles, ArrowRight, Heart, ShoppingBag } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

export default function FormalPage() {
  const { getProductsByCategory, loading } = useProducts()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  
  const products = useMemo(() => {
    return getProductsByCategory('Formal')
  }, [getProductsByCategory])

  const handleQuickAdd = async (product: any) => {
    setAddingToCart(product.id)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Default'
    })
    setTimeout(() => {
      setAddingToCart(null)
    }, 1000)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E]">
        
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B101E] via-[#162034] to-[#1A2538]"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 text-center pt-32 pb-20">
            {/* Collection Badge */}
            <div className="inline-block mb-6">
              <span className="text-[#D4AF37] text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold px-6 py-2 border border-[#D4AF37]/30 rounded-full bg-[#D4AF37]/5">
                THE 2024 COLLECTION
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Timeless <span className="italic text-[#D4AF37]" style={{fontFamily: 'Georgia, serif'}}>Elegance.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-12">
              Sophisticated craftsmanship for the modern gentleman. From boardrooms to galas, experience footwear that commands respect.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="#products"
                className="group px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 flex items-center gap-2"
              >
                View Editorial
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#products"
                className="px-10 py-4 bg-transparent border-2 border-white/20 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-white/5 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                Shop Collection
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="flex flex-col items-center gap-3">
              <ChevronRight size={20} className="text-[#D4AF37] rotate-90 animate-bounce" />
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center hover:scale-110 transition-transform">
                  <Sparkles size={18} className="text-[#0B101E]" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-all">
                  <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                    <div className="bg-white/60 rounded-sm"></div>
                    <div className="bg-white/60 rounded-sm"></div>
                    <div className="bg-white/60 rounded-sm"></div>
                    <div className="bg-white/60 rounded-sm"></div>
                  </div>
                </button>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-all">
                  <div className="w-5 h-5 grid grid-cols-3 gap-0.5">
                    <div className="bg-white/60 rounded-sm"></div>
                    <div className="bg-white/60 rounded-sm"></div>
                    <div className="bg-white/60 rounded-sm"></div>
                  </div>
                </button>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-all">
                  <div className="h-5 flex items-center gap-1">
                    <div className="w-1 bg-white/60 rounded-full" style={{height: '12px'}}></div>
                    <div className="w-1 bg-white/60 rounded-full" style={{height: '16px'}}></div>
                    <div className="w-1 bg-white/60 rounded-full" style={{height: '12px'}}></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Collection Section */}
        <section id="products" className="py-20 bg-[#0B101E]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            
            {/* Section Header */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  Executive <span className="text-[#D4AF37]">Collection</span>
                </h2>
                <p className="text-gray-400 text-base md:text-lg max-w-2xl">
                  Premium engineered sneakers that redefine the boundary between performance and luxury
                </p>
              </div>
              <Link 
                href="/formal" 
                className="hidden md:flex items-center gap-2 text-[#D4AF37] hover:text-[#F4CE5C] transition-colors font-semibold"
              >
                View All Formal 
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin mb-6" />
                <p className="text-gray-400 text-lg">Loading premium collection...</p>
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-32 bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-3xl border border-white/10">
                <div className="text-8xl mb-6">👔</div>
                <h3 className="text-3xl font-bold text-white mb-3">Coming Soon</h3>
                <p className="text-gray-400 text-lg mb-8">Our formal collection is being curated</p>
                <Link 
                  href="/"
                  className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {products.map((product, index) => (
                  <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="group block relative"
                  >
                    {/* NEW ARRIVAL Badge */}
                    {product.isNewArrival && index === 0 && (
                      <div className="absolute -top-3 -left-3 z-20">
                        <span className="bg-[#D4AF37] text-[#0B101E] px-4 py-1.5 text-[9px] font-extrabold tracking-[0.2em] uppercase rounded-full shadow-xl">
                          NEW ARRIVAL
                        </span>
                      </div>
                    )}

                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-500 border border-transparent hover:border-[#D4AF37]/30">
                      
                      {/* Product Image */}
                      <div className={`relative ${index === 0 ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-[#06080F]/45 rounded-2xl shadow-[0_10px_24px_-18px_rgba(6,8,15,0.55)]`}>
                        <HoverSwapImage
                          primaryImage={product.image}
                          secondaryImage={product.secondaryImage}
                          alt={product.name}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          fitClassName="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        
                        {/* Badges */}
                        {product.isOnSale && (
                          <div className="absolute top-4 right-4 z-10">
                            <span className="bg-red-600 text-white px-3 py-1 text-[9px] font-extrabold tracking-[0.2em] uppercase rounded-full shadow-lg">
                              SALE
                            </span>
                          </div>
                        )}
                        
                        {/* Out of Stock Overlay */}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white text-xl font-bold uppercase tracking-wider">Out of Stock</span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                          <div className="flex gap-3 w-full">
                            <button 
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleQuickAdd(product)
                              }}
                              disabled={addingToCart === product.id}
                              className="flex-1 bg-[#D4AF37] text-[#0B101E] py-3 rounded-full font-bold text-sm hover:bg-[#F4CE5C] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              <ShoppingBag size={16} />
                              {addingToCart === product.id ? 'Added!' : 'Quick Add'}
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleWishlist(product.id)
                              }}
                              className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border ${
                                isWishlisted(product.id)
                                  ? 'bg-[#D4AF37] border-[#D4AF37]'
                                  : 'bg-white/10 border-white/20 hover:bg-white/20'
                              }`}
                            >
                              <Heart 
                                size={18} 
                                className={isWishlisted(product.id) ? 'text-[#0B101E] fill-[#0B101E]' : 'text-white'}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5 bg-gradient-to-br from-gray-800 to-gray-900">
                        {index === 0 && (
                          <p className="text-[#D4AF37] text-[9px] tracking-[0.25em] uppercase font-bold mb-2">
                            {product.brand || product.category}
                          </p>
                        )}
                        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#D4AF37] transition-colors">
                          {product.name}
                        </h3>
                        <div className="mb-3">
                          <p className="text-[#D4AF37] font-bold text-xl">
                            PKR {product.price.toLocaleString()}
                          </p>
                          {product.originalPrice && product.originalPrice > product.price ? (
                            <p className="text-gray-400 text-xs line-through">PKR {product.originalPrice.toLocaleString()}</p>
                          ) : null}
                        </div>
                        
                        {/* Wishlist Icon (for smaller cards) */}
                        {index !== 0 && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleWishlist(product.id)
                            }}
                            className={`absolute top-5 right-5 w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-lg group/btn ${
                              isWishlisted(product.id)
                                ? 'bg-[#D4AF37] text-white'
                                : 'bg-white/90 hover:bg-[#D4AF37] hover:text-white'
                            }`}
                          >
                            <Heart 
                              size={16} 
                              className={`group-hover/btn:scale-110 transition-transform ${
                                isWishlisted(product.id) ? 'fill-white' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-[#0B101E] to-[#162034]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-3 gap-12">
              
              {/* Feature 1 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F4CE5C] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-[#D4AF37]/20">
                  <Award size={32} className="text-[#0B101E]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 uppercase tracking-wider">Artisan Crafted</h3>
                <p className="text-gray-400 leading-relaxed">
                  Every pair is handcrafted by master artisans with decades of expertise
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F4CE5C] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-[#D4AF37]/20">
                  <Sparkles size={32} className="text-[#0B101E]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 uppercase tracking-wider">Italian Leather</h3>
                <p className="text-gray-400 leading-relaxed">
                  Sourced from the finest tanneries in Italy for uncompromising quality
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F4CE5C] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-[#D4AF37]/20">
                  <Shield size={32} className="text-[#0B101E]" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 uppercase tracking-wider">Lifetime Warranty</h3>
                <p className="text-gray-400 leading-relaxed">
                  We stand behind our craftsmanship with a lifetime guarantee
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
