'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* 1. Branded Banner Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 mt-[-14vh] md:mt-[-16vh]">
        <motion.div
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#D4AF37]/20 via-[#F4CE5C]/15 to-[#D4AF37]/20 rounded-full" />
          <div className="relative px-6 md:px-10 py-4 md:py-5 rounded-full border border-[#D4AF37]/35 bg-[#0B101E]/55 backdrop-blur-xl shadow-[0_0_50px_rgba(212,175,55,0.2)]">
            <p className="text-center text-[9px] md:text-[11px] uppercase tracking-[0.45em] text-[#D4AF37]/90 font-bold mb-1 md:mb-2">
              Signature Luxury Footwear
            </p>
            <h1 className="text-[12vw] md:text-[8.5vw] leading-[0.9] font-serif font-black tracking-[0.06em] whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5CF] via-[#E7C36A] to-[#D4AF37] drop-shadow-[0_10px_35px_rgba(0,0,0,0.55)]">
              B&B SHOES
            </h1>
            <p className="text-center text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-white/65 font-semibold mt-2">
              Multan Atelier • Since 2023
            </p>
          </div>

          <div className="mt-4 md:mt-5 flex items-center justify-center gap-2 md:gap-3">
            <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-[10px] tracking-[0.18em] uppercase font-semibold">
              Handcrafted Finish
            </span>
            <span className="px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F4CE5C] text-[10px] tracking-[0.18em] uppercase font-semibold">
              Premium Comfort
            </span>
          </div>
        </motion.div>
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
        <div className="bg-[#121A2F]/60 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1.2fr_0.9fr] gap-8 items-center shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
          
          {/* Left: Context */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <p className="text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase font-bold">
                B&B Signature Drop
              </p>
            </div>
            <p className="text-white/80 text-sm max-w-[280px] leading-relaxed font-light">
              Crafted in Multan with modern luxury aesthetics and all-day comfort for every occasion.
            </p>

            <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-white/45 font-semibold pt-1">
              <span>Artisan Build</span>
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
              <span>Exclusive Finish</span>
            </div>
          </div>

          {/* Center: Primary Actions */}
          <div className="flex items-center justify-center">
            <Link href="/collections#all-products-grid" className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0B101E] text-xs font-bold tracking-[0.15em] uppercase rounded-full hover:bg-white hover:scale-105 transition-all duration-300">
              Shop Collection
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

        </div>
      </motion.div>
    </section>
  )
}