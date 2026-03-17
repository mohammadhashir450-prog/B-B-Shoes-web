'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

const items = [
  {
    id: 1,
    title: "Gentlemen's Heritage",
    subtitle: "Classic Oxfords & Brogues",
    // High-end men's leather shoes
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000",
  },
  {
    id: 2,
    title: "Modern Elegance",
    subtitle: "Sleek Silhouettes",
    // Premium elegant footwear
    image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1000",
  },
  {
    id: 3,
    title: "Urban Edge",
    subtitle: "Luxury Streetwear Sneakers",
    // High-end sneakers
    image: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=1000",
  },
  {
    id: 4,
    title: "The Atelier",
    subtitle: "Bespoke Craftsmanship",
    // Leather crafting / shoe details
    image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000",
  }
]

export default function Curated() {
  // Keep the first item expanded by default
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)

  return (
    <section className="relative bg-[#0B101E] py-32 overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        
        {/* Cinematic Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2">
                <Sparkles size={12} /> Exclusives
              </p>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-[80px] font-serif font-black leading-[0.9] tracking-tight text-white">
              Curated
              <br />
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] md:[-webkit-text-stroke:2px_rgba(255,255,255,0.4)]">
                Collections
              </span>
            </h2>
          </div>
          
          <p className="text-white/50 text-sm max-w-[300px] leading-relaxed font-light mb-2">
            Explore our meticulously crafted collections, designed to elevate every step with uncompromising luxury.
          </p>
        </motion.div>

        {/* Interactive Expanding Gallery */}
        <div className="flex flex-col md:flex-row gap-4 h-[600px] md:h-[550px] w-full">
          {items.map((item, index) => {
            const isActive = hoveredIndex === index;

            return (
              <motion.div
                key={item.id}
                layout // This tells Framer Motion to smoothly animate flex changes
                onMouseEnter={() => setHoveredIndex(index)}
                // Mobile gets flex-col expanding, Desktop gets flex-row expanding
                className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? 'flex-[4] md:flex-[5]' : 'flex-1'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover transition-transform duration-[1.5s] ease-out ${
                      isActive ? 'scale-105' : 'scale-125 saturate-50 brightness-75'
                    }`}
                  />
                </div>

                {/* Gradients to ensure text readability */}
                <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${
                  isActive ? 'from-[#0B101E]/90 via-[#0B101E]/20 to-transparent opacity-100' : 'from-[#0B101E]/80 to-[#0B101E]/40 opacity-80'
                }`} />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      // Expanded State Content
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex items-end justify-between gap-4 w-full"
                      >
                        <div>
                          <p className="text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase font-bold mb-2">
                            {item.subtitle}
                          </p>
                          <h3 className="font-serif font-bold text-white text-3xl md:text-4xl leading-tight whitespace-nowrap">
                            {item.title}
                          </h3>
                        </div>

                        {/* Action Button */}
                        <button className="hidden md:flex w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 items-center justify-center text-white hover:bg-white hover:text-[#0B101E] transition-all duration-500 flex-shrink-0 group">
                          <ArrowUpRight size={20} className="transform group-hover:rotate-45 transition-transform duration-500" />
                        </button>
                      </motion.div>
                    ) : (
                      // Collapsed State Content (Vertical Text)
                      <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-end h-full pb-4"
                      >
                        <h3 className="font-serif font-bold text-white/50 text-xl tracking-widest whitespace-nowrap md:-rotate-90 md:origin-bottom md:translate-y-12 transition-colors hover:text-white">
                          {item.title}
                        </h3>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
        
      </div>
    </section>
  )
}