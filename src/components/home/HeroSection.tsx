'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Award } from 'lucide-react'

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative h-screen bg-[#0B101E] overflow-hidden flex flex-col justify-end" suppressHydrationWarning>
      
      {/* Subtle Premium Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(199,154,43,0.2),transparent_38%),radial-gradient(circle_at_78%_75%,rgba(15,39,71,0.35),transparent_42%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* 1. Highly Visible Background Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 mt-[-14vh] md:mt-[-16vh]">
        <motion.h1 
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-[20vw] md:text-[16vw] font-serif font-black text-white/10 leading-[0.75] tracking-tighter whitespace-nowrap drop-shadow-2xl"
        >
          PURE
        </motion.h1>
        <motion.h1 
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          // Designer trick: Transparent fill with a Gold text stroke
          className="text-[20vw] md:text-[16vw] font-serif font-black text-transparent [-webkit-text-stroke:2px_rgba(212,175,55,0.6)] md:[-webkit-text-stroke:4px_rgba(212,175,55,0.4)] leading-[0.75] tracking-tighter whitespace-nowrap"
        >
          ARTISTRY
        </motion.h1>
      </div>

      {/* 2. Center Stage Floating Product */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div 
          initial={false}
          animate={mounted ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative w-full max-w-[700px] aspect-square md:aspect-video mt-[-14vh] md:mt-[-16vh]"
        >
          {/* Intense gold radial glow to highlight the shoe */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-[#D4AF37]/20 to-[#D4AF37]/5 blur-[100px] rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-6 py-3 rounded-full border border-[#D4AF37]/35 bg-black/40 backdrop-blur-xl shadow-[0_0_35px_rgba(199,154,43,0.2)]">
              <p className="text-[#D4AF37] text-[11px] tracking-[0.32em] uppercase font-bold">Premium Footwear Archive</p>
            </div>
          </div>
          
          {/* <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full h-full relative"
          > */}
            {/* IMPORTANT: Ensure 'herosection_image' is a .PNG or .WEBP file, not a .JPG */}
            {/* <Image
              src="/images/herosection_image.jpg" 
              alt="Premium Product"
              fill
              className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.9)] pointer-events-auto cursor-crosshair hover:scale-110 transition-transform duration-700 ease-out"
              priority
            /> */}
          {/* </motion.div> */}
        </motion.div>
      </div>

      {/* 3. Bottom Glass Control Bar */}
      <motion.div 
        initial={false}
        animate={mounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-0 md:pb-2 translate-y-8 md:translate-y-12"
      >
        <div className="bg-[#101826]/85 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1.1fr_1fr_auto] gap-8 items-center shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
          
          {/* Left: Context */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <p className="text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase font-bold">
                Trendy Collection
              </p>
            </div>
            <p className="text-white/80 text-sm max-w-[280px] leading-relaxed font-light">
              Redefining luxury footwear through centuries of craftsmanship and modern Italian design.
            </p>
          </div>

          {/* Center: Primary Actions */}
          <div className="flex items-center justify-center md:justify-start">
            <Link href="/collections#all-products-grid" className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0B101E] text-xs font-bold tracking-[0.15em] uppercase rounded-full hover:bg-white hover:scale-105 transition-all duration-300">
              Shop Collection
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right: Status Chip */}
          <div className="hidden md:flex justify-end">
            <div className="px-5 py-3 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-right">
              <p className="text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase font-bold">New Seasonal Drop</p>
              <p className="text-white text-xs mt-1">Limited pieces available</p>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  )
}