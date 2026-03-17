'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Sparkles } from 'lucide-react'

// Upgraded premium data
const products = [
  {
    id: 1,
    name: "Midnight Monarch",
    brand: "LUXURY DETAILS",
    price: "$1,299",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    badge: "ARTISAN"
  },
  {
    id: 2,
    name: "Vanguard Oneless",
    brand: "SIGNATURE SERIES",
    price: "$850",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    badge: "LIMITED"
  },
  {
    id: 3,
    name: "Toscana Loafer",
    brand: "MILAN CRAFT",
    price: "$975",
    image: "https://images.unsplash.com/photo-1614252229435-21052e89009a?w=600&q=80",
    badge: "NEW"
  },
  {
    id: 4,
    name: "Versailles Boot",
    brand: "HERITAGE LINE",
    price: "$1,450",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80",
    badge: "ARTISAN"
  },
  {
    id: 5,
    name: "Royal Oxford",
    brand: "SIGNATURE SERIES",
    price: "$1,100",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80",
    badge: "RESTOCKED"
  }
]

export default function GoldEdition() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Responsive items per page calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1)
      else if (window.innerWidth < 1024) setItemsPerPage(2)
      else if (window.innerWidth < 1280) setItemsPerPage(3)
      else setItemsPerPage(4)
    }
    
    handleResize() // Initial call
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, products.length - itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  return (
    <section className="relative bg-[#0B101E] py-32 overflow-hidden">
      
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        
        {/* Section Header */}
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
                <Sparkles size={12} /> The Signature
              </p>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-black text-white leading-tight">
              Gold Edition
            </h2>
          </motion.div>
          
          {/* Custom Navigation Arrows */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex gap-4"
          >
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`w-14 h-14 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 ${
                currentIndex === 0 
                  ? 'border-white/5 text-white/20 cursor-not-allowed' 
                  : 'border-white/20 bg-white/5 text-white hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B101E]'
              }`}
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className={`w-14 h-14 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 ${
                currentIndex === maxIndex 
                  ? 'border-white/5 text-white/20 cursor-not-allowed' 
                  : 'border-white/20 bg-white/5 text-white hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B101E]'
              }`}
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

        {/* Carousel Track */}
        <div className="overflow-hidden" ref={carouselRef}>
          <motion.div 
            animate={{ x: `calc(-${currentIndex * (100 / itemsPerPage)}%)` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="flex"
            style={{ width: `${(products.length / itemsPerPage) * 100}%` }}
          >
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="px-3"
                style={{ width: `${100 / products.length}%` }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-[#121A2F]/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-colors duration-500"
                >
                  
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-8">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 ease-out drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-5 left-5">
                      <span className="bg-[#D4AF37] text-[#0B101E] px-4 py-2 text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        {product.badge}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-5 right-5 w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-white/10 hover:border-red-400/50 transition-all duration-300 z-20">
                      <Heart size={16} strokeWidth={2} />
                    </button>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-5 bottom-5 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-20">
                      <button className="w-full bg-white text-[#0B101E] py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-[#D4AF37] transition-colors">
                        <ShoppingBag size={14} />
                        Quick Add
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 md:p-8 border-t border-white/5">
                    <p className="text-[#D4AF37] text-[9px] tracking-[0.25em] uppercase mb-2 font-bold">
                      {product.brand}
                    </p>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xl font-serif font-bold text-white leading-tight group-hover:text-[#D4AF37] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-lg font-medium text-white/90 whitespace-nowrap">
                        {product.price}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
        
      </div>
    </section>
  )
}