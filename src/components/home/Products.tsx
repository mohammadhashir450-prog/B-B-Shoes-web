'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, ArrowUpRight } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

export default function Products() {
  const { allProducts, loading } = useProducts()

  // Get first 4 regular products (not on sale, not new arrivals)
  const regularProducts = useMemo(() => {
    return allProducts
      .filter((p) => !p.isOnSale && !p.isNewArrival)
      .slice(0, 4)
  }, [allProducts])

  // Premium Loading State
  if (loading) {
    return (
      <section className="relative bg-[#0B101E] py-32 overflow-hidden min-h-[50vh] flex items-center justify-center">
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
      <section className="relative bg-[#0B101E] py-32 overflow-hidden min-h-[50vh] flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 text-center max-w-lg mx-auto px-6">
          <div className="w-24 h-24 mx-auto bg-white/5 border border-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <ShoppingBag className="w-10 h-10 text-white/40" strokeWidth={1} />
          </div>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">The Vault is Empty</h3>
          <p className="text-white/50 text-sm leading-relaxed font-light">
            Our artisans are currently crafting new pieces. Please return shortly to view the latest exclusive additions to this collection.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-[#0B101E] py-32 overflow-hidden">
      
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        
        {/* Cinematic Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2">
                <Sparkles size={12} /> Exclusives
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-white leading-tight mb-4">
              The Gold Edition
            </h2>
            <p className="text-white/50 text-sm max-w-[300px] leading-relaxed font-light">
              Exclusive releases meticulously crafted by our luxury artisans.
            </p>
          </motion.div>
          
          {/* Subtle Navigation UI (If you expand to a slider later, these are ready) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex gap-4"
          >
            <button className="w-12 h-12 rounded-full backdrop-blur-md border border-white/20 bg-white/5 flex items-center justify-center text-white hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B101E] transition-all duration-300">
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button className="w-12 h-12 rounded-full backdrop-blur-md border border-white/20 bg-white/5 flex items-center justify-center text-white hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B101E] transition-all duration-300">
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

        {/* Premium Glassmorphism Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {regularProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative bg-[#121A2F]/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
            >
              <Link href={`/product/${product.id}`} className="block h-full flex flex-col">
                
                {/* Image Section */}
                <div className="relative aspect-[4/5] bg-[#0B101E] overflow-hidden">
                  <Image
                    src={product.image || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 group-hover:-rotate-1 transition-transform duration-[1.5s] ease-out opacity-90 group-hover:opacity-100"
                    unoptimized={product.image?.includes('cloudinary')}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                  
                  {/* Subtle Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121A2F] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Artisan Badge */}
                  <div className="absolute top-5 left-5 z-20">
                    <span className="bg-[#D4AF37] text-[#0B101E] px-4 py-2 text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                      ARTISAN
                    </span>
                  </div>
                  
                  {/* Wishlist Button (Stop propagation to avoid triggering link) */}
                  <button 
                    onClick={(e) => e.preventDefault()}
                    className="absolute top-5 right-5 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-white/20 hover:border-red-400/50 transition-all duration-300 z-20"
                  >
                    <Heart size={16} strokeWidth={2} />
                  </button>
                </div>

                {/* Product Info Section */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between border-t border-white/5 relative z-20 bg-gradient-to-b from-transparent to-[#121A2F]/50">
                  <div>
                    <p className="text-[#D4AF37] text-[9px] tracking-[0.25em] uppercase mb-3 font-bold">
                      {product.brand || 'B&B EXCLUSIVE'}
                    </p>
                    <h3 className="text-xl font-serif font-bold text-white leading-tight mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-end justify-between mt-6">
                    <p className="text-lg font-medium text-white/90">
                      PKR {product.price.toLocaleString()}
                    </p>
                    
                    {/* Arrow Interaction */}
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#D4AF37] group-hover:text-[#0B101E] group-hover:border-[#D4AF37] transition-all duration-500">
                      <ArrowUpRight size={18} className="transform group-hover:rotate-45 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
                
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}