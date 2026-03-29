'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'
import { useWishlist } from '@/context/WishlistContext'
import HoverSwapImage from '@/components/common/HoverSwapImage'

export default function Products() {
  const { allProducts, loading } = useProducts()
  const { isWishlisted, toggleWishlist } = useWishlist()

  // Get first 4 regular products (not on sale, not new arrivals)
  const regularProducts = useMemo(() => {
    return allProducts
      .filter((p) => !p.isOnSale && !p.isNewArrival)
      .slice(0, 4)
  }, [allProducts])

  // Premium Loading State
  if (loading) {
    return (
      <section className="relative bg-white py-32 overflow-hidden min-h-[50vh] flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="w-12 h-12 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
          <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">
            Curating Collection
          </p>
        </div>
      </section>
    )
  }

  // Premium Empty State
  if (regularProducts.length === 0 && !loading) {
    return (
      <section className="relative bg-white py-32 overflow-hidden min-h-[50vh] flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 text-center max-w-lg mx-auto px-6">
          <div className="w-24 h-24 mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <ShoppingBag className="w-10 h-10 text-[#4F5A69]" strokeWidth={1} />
          </div>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#18202B] mb-4">The Vault is Empty</h3>
          <p className="text-[#4F5A69] text-sm leading-relaxed font-light">
            Our artisans are currently crafting new pieces. Please return shortly to view the latest exclusive additions to this collection.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-[#FCFBF8] py-12 md:py-20 overflow-hidden">
      
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        
        {/* Cinematic Section Header */}
        <div className="flex flex-col mb-6 md:mb-8 gap-2">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-[28px] md:text-4xl lg:text-5xl font-serif font-black text-[#18202B] leading-tight mb-1">
              Featured Picks
            </h2>
            <p className="text-[#4F5A69] text-sm max-w-[380px] leading-relaxed">
              Simple, quick, and easy to shop.
            </p>
          </motion.div>
        </div>

        {/* Clean Horizontal Product Rail */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 scroll-px-4 sm:scroll-px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {regularProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative shrink-0 w-[84vw] max-w-[300px] sm:w-[300px] lg:w-[320px] snap-start bg-white border border-[#E7E0D1] rounded-2xl overflow-hidden transition-all duration-400 hover:border-[#D4AF37]/45 hover:shadow-[0_18px_34px_-18px_rgba(24,32,43,0.22)]"
              >
                <Link href={`/product/${product.id}`} className="h-full flex flex-col">
                  
                  {/* Image Section */}
                  <div className="relative h-[195px] sm:h-[230px] lg:h-[245px] bg-[#FAF9F7] overflow-hidden p-3 rounded-xl border border-[#06080F]/45 shadow-[0_12px_24px_-18px_rgba(6,8,15,0.5)] transition-all duration-400 group-hover:border-[#06080F]/70">
                    <HoverSwapImage
                      primaryImage={product.image}
                      secondaryImage={product.secondaryImage}
                      alt={product.name}
                      sizes="(max-width: 768px) 80vw, (max-width: 1200px) 45vw, 340px"
                      fitClassName="object-contain p-3 group-hover:scale-105 transition-transform duration-600 ease-out"
                    />
                    
                    {/* Wishlist Button (Stop propagation to avoid triggering link) */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product.id)
                      }}
                      className={`absolute top-4 right-4 w-9 h-9 backdrop-blur-md border rounded-full flex items-center justify-center transition-all duration-300 z-20 ${
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
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#18202B] leading-tight mb-2 group-hover:text-[#A97A18] transition-colors line-clamp-2 min-h-[46px] sm:min-h-[52px]">
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-base font-bold text-[#D4AF37]">
                          PKR {product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-10 bg-gradient-to-r from-[#FCFBF8] to-transparent" />
          <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-10 bg-gradient-to-l from-[#FCFBF8] to-transparent" />
        </div>
      </div>
    </section>
  )
}