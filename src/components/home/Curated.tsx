'use client'

import { useEffect, useState } from 'react'
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
    // Editorial sneaker portrait
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1400&q=80",
    link: "/new-arrivals",
    accentGlow: "group-hover:shadow-[0_0_46px_-12px_rgba(96,165,250,0.35)]" // Blue glow
  },
  {
    id: 2,
    title: "Sales & Discounts",
    subtitle: "Private Insider Event",
    icon: Tag,
    // Bold sale-focused composition
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80",
    link: "/sales",
    accentGlow: "group-hover:shadow-[0_0_46px_-12px_rgba(248,113,113,0.35)]" // Red glow
  },
  {
    id: 3,
    title: "All Products",
    subtitle: "Complete Portfolio",
    icon: Grid,
    // Contemporary premium lineup visual
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1400&q=80",
    link: "/collections",
    accentGlow: "group-hover:shadow-[0_0_46px_-12px_rgba(212,175,55,0.35)]" // Gold glow
  }
]

export default function Curated() {
  // Keep the first item expanded by default
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)
  const [isAutoPaused, setIsAutoPaused] = useState(false)

  useEffect(() => {
    if (isAutoPaused) return

    const autoSlider = setInterval(() => {
      setHoveredIndex((prev) => (prev + 1) % items.length)
    }, 3800)

    return () => clearInterval(autoSlider)
  }, [isAutoPaused])

  return (
    <section className="relative bg-white py-20 md:py-24 overflow-hidden selection:bg-[#D4AF37]/30 selection:text-[#18202B]">
      
      {/* Cinematic Ambient Background Glow */}
      <div className="absolute top-1/2 left-0 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#D4AF37]/8 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

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
            <h2 className="text-5xl md:text-7xl lg:text-[80px] font-serif font-black leading-[0.9] tracking-tight text-[#18202B]">
              Curated
              <br />
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(24,32,43,0.28)] md:[-webkit-text-stroke:2px_rgba(24,32,43,0.28)]">
                Collections
              </span>
            </h2>
          </div>
          
          <p className="text-[#4F5A69] text-sm max-w-[300px] leading-relaxed font-light mb-2">
            Explore our meticulously crafted divisions, designed to elevate every step with uncompromising luxury.
          </p>
        </motion.div>

        {/* Interactive Expanding Gallery */}
        <div
          className="flex flex-col md:flex-row gap-4 h-[600px] md:h-[550px] w-full group/gallery"
          onMouseEnter={() => setIsAutoPaused(true)}
          onMouseLeave={() => setIsAutoPaused(false)}
        >
          {items.map((item, index) => {
            const isActive = hoveredIndex === index;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                layout // Framer Motion magic for smooth flexbox changes
                onMouseEnter={() => setHoveredIndex(index)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden rounded-3xl cursor-pointer bg-white border border-[#E4D8C3] group transition-all duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? 'flex-[4] md:flex-[6]' : 'flex-1 md:hover:flex-[1.5]'
                } ${item.accentGlow}`}
              >
                <Link href={item.link} className="block w-full h-full cursor-pointer relative z-10">
                  
                  {/* Background Image with Cinematic Parallax */}
                  <div className="absolute inset-0 w-full h-full bg-white">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`object-cover transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive 
                          ? 'scale-105 saturate-105 brightness-105' 
                          : 'scale-125 saturate-50 brightness-50 opacity-60'
                      }`}
                    />
                  </div>

                  {/* Subtle moving color haze for modern depth */}
                  <motion.div
                    aria-hidden
                    animate={{
                      x: isActive ? [0, 24, -18, 0] : 0,
                      y: isActive ? [0, -16, 10, 0] : 0,
                      scale: isActive ? [1, 1.12, 1.02, 1] : 1,
                    }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-white/35 via-[#D4AF37]/20 to-transparent blur-3xl"
                  />

                  {/* Light sweep on hover */}
                  <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent rotate-12 group-hover:translate-x-[520%] transition-transform duration-[1200ms] ease-out" />

                  {/* Adaptive Gradients for Text Legibility */}
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-[1s] ${
                    isActive 
                    ? 'from-[#18202B]/50 via-[#18202B]/20 to-transparent opacity-95' 
                        : 'from-[#18202B]/35 to-[#18202B]/12 opacity-80'
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
                            className="hidden md:flex w-14 h-14 rounded-full backdrop-blur-md bg-white/25 border border-white/50 items-center justify-center text-white hover:bg-white hover:text-[#18202B] hover:scale-110 transition-all duration-500 flex-shrink-0"
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
                            <Icon size={20} className="text-[#253041] hidden md:block" />
                            <h3 className="font-serif font-bold text-[#253041] text-xl md:text-2xl tracking-widest whitespace-nowrap md:-rotate-90 md:origin-bottom md:translate-y-16">
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