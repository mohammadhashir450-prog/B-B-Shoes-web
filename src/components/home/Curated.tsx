'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Sparkles, Tag, Grid } from 'lucide-react'

// Updated data with requested categories
const items = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "The Vanguard Series",
    icon: Sparkles,
    // High-end footwear image
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000",
    link: "/new-arrivals",
    accentGlow: "group-hover:shadow-[0_0_40px_-10px_rgba(96,165,250,0.3)]" // Blue glow
  },
  {
    id: 2,
    title: "Sales & Discounts",
    subtitle: "Private Insider Event",
    icon: Tag,
    // Premium elegant footwear
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000",
    link: "/sales",
    accentGlow: "group-hover:shadow-[0_0_40px_-10px_rgba(248,113,113,0.3)]" // Red glow
  },
  {
    id: 3,
    title: "All Products",
    subtitle: "Complete Portfolio",
    icon: Grid,
    // Classic/Heritage shoes
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000",
    link: "/collections",
    accentGlow: "group-hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.3)]" // Gold glow
  }
]

export default function Curated() {
  // Keep the first item expanded by default
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)

  return (
    <section className="relative bg-[#0B101E] py-20 md:py-24 overflow-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      
      {/* Cinematic Ambient Background Glow */}
      <div className="absolute top-1/2 left-0 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        
        {/* Cinematic Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-[#D4AF37]"></div>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2">
                <Sparkles size={12} /> The Archives
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
            Explore our meticulously crafted divisions, designed to elevate every step with uncompromising luxury.
          </p>
        </motion.div>

        {/* Interactive Expanding Gallery */}
        <div className="flex flex-col md:flex-row gap-4 h-[600px] md:h-[550px] w-full group/gallery">
          {items.map((item, index) => {
            const isActive = hoveredIndex === index;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                layout // Framer Motion magic for smooth flexbox changes
                onMouseEnter={() => setHoveredIndex(index)}
                className={`relative overflow-hidden rounded-3xl cursor-pointer bg-[#121A2F] border border-white/5 group transition-all duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? 'flex-[4] md:flex-[6]' : 'flex-1 md:hover:flex-[1.5]'
                } ${item.accentGlow}`}
              >
                <Link href={item.link} className="block w-full h-full cursor-pointer relative z-10">
                  
                  {/* Background Image with Cinematic Parallax */}
                  <div className="absolute inset-0 w-full h-full bg-[#0B101E]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive 
                          ? 'scale-105 saturate-100 brightness-100' 
                          : 'scale-125 saturate-50 brightness-50 opacity-60'
                      }`}
                    />
                  </div>

                  {/* Adaptive Gradients for Text Legibility */}
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-[1s] ${
                    isActive 
                      ? 'from-[#0B101E] via-[#0B101E]/40 to-transparent opacity-90' 
                      : 'from-[#0B101E]/90 to-[#0B101E]/40 opacity-80'
                  }`} />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <AnimatePresence mode="wait">
                      {isActive ? (
                        // EXPANDED STATE (Active Card)
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                          className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full"
                        >
                          <div>
                            {/* Subtitle pops up first */}
                            <motion.p 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.3 }}
                              className="text-[#D4AF37] flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold mb-3"
                            >
                              <Icon size={12} /> {item.subtitle}
                            </motion.p>
                            
                            {/* Massive Title */}
                            <motion.h3 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                              className="font-serif font-black text-white text-4xl md:text-5xl leading-[1.1] whitespace-nowrap"
                            >
                              {item.title}
                            </motion.h3>
                          </div>

                          {/* Hover Action Button (Glassmorphism) */}
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="hidden md:flex w-14 h-14 rounded-full backdrop-blur-md bg-white/10 border border-white/20 items-center justify-center text-white hover:bg-white hover:text-[#0B101E] hover:scale-110 transition-all duration-500 flex-shrink-0"
                          >
                            <ArrowUpRight size={24} className="transform group-hover:rotate-45 transition-transform duration-500" />
                          </motion.div>
                        </motion.div>

                      ) : (

                        // COLLAPSED STATE (Inactive Vertical Text)
                        <motion.div
                          key="collapsed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center justify-end h-full pb-4"
                        >
                          <div className="flex flex-col items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
                            <Icon size={20} className="text-white hidden md:block" />
                            <h3 className="font-serif font-bold text-white text-xl md:text-2xl tracking-widest whitespace-nowrap md:-rotate-90 md:origin-bottom md:translate-y-16">
                              {item.title}
                            </h3>
                          </div>
                        </motion.div>

                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
        
      </div>
    </section>
  )
}