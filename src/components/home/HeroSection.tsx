'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Award } from 'lucide-react'

function ShoeGlyph({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 110"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 73C25 70 40 62 57 45C67 35 79 30 93 30H126C135 30 143 35 149 42L162 56C170 64 180 70 191 73L205 76C210 77 214 81 214 86C214 92 209 97 203 97H18C10 97 4 92 4 85C4 79 8 75 14 73Z"
        className="fill-white/90"
      />
      <path d="M56 52L73 52" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <path d="M69 47L86 47" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <path d="M83 44L100 44" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <path d="M97 42L114 42" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 84H214" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 90H42" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <path d="M53 90H69" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 90H96" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <path d="M107 90H123" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <path d="M134 90H150" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <path d="M161 90H177" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-[#090D18] overflow-hidden flex flex-col justify-end" suppressHydrationWarning>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.2),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(55,102,212,0.18),transparent_45%),linear-gradient(180deg,#090D18_0%,#0E1426_55%,#111C33_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:84px_84px] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none z-10">
        <motion.div
          initial={false}
          animate={mounted ? { y: [0, -18, 0], rotate: [-6, -2, -6] } : { y: 0, rotate: -6 }}
          transition={{ repeat: Infinity, duration: 7.5, ease: 'easeInOut' }}
          className="absolute left-[4%] top-[23%] w-28 h-20 md:w-40 md:h-28"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D4AF37]/40 to-[#F4CE5C]/20 blur-2xl" />
          <ShoeGlyph className="relative w-full h-full drop-shadow-[0_16px_20px_rgba(0,0,0,0.4)]" />
        </motion.div>

        <motion.div
          initial={false}
          animate={mounted ? { y: [0, 16, 0], rotate: [4, 9, 4] } : { y: 0, rotate: 4 }}
          transition={{ repeat: Infinity, duration: 8.5, ease: 'easeInOut', delay: 0.6 }}
          className="absolute right-[5%] top-[27%] w-32 h-24 md:w-44 md:h-30"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#5EA1FF]/35 to-[#8BC3FF]/20 blur-2xl" />
          <ShoeGlyph className="relative w-full h-full drop-shadow-[0_16px_20px_rgba(0,0,0,0.45)]" />
        </motion.div>

        <motion.div
          initial={false}
          animate={mounted ? { y: [0, -12, 0], rotate: [0, 3, 0], scale: [1, 1.04, 1] } : { y: 0, rotate: 0, scale: 1 }}
          transition={{ repeat: Infinity, duration: 6.2, ease: 'easeInOut', delay: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2 top-[28%] w-48 h-32 md:w-[360px] md:h-[220px]"
        >
          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/20 to-white/5 border border-white/20 backdrop-blur-sm" />
          <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.32),transparent_68%)]" />
          <ShoeGlyph className="relative w-full h-full p-3 md:p-6 drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" />
        </motion.div>
      </div>

      <div className="relative z-20 pt-24 md:pt-28 px-6 md:px-10 text-center">
        <motion.p
          initial={false}
          animate={mounted ? { opacity: [0, 1], y: [12, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold"
        >
          Signature Luxury Footwear
        </motion.p>
        <motion.h1
          initial={false}
          animate={mounted ? { opacity: [0, 1], y: [20, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
          className="mt-4 text-[17vw] md:text-[10vw] leading-[0.88] font-serif font-black tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF6D2] via-[#E6C068] to-[#BE9332]"
        >
          B&B SHOES
        </motion.h1>
        <motion.p
          initial={false}
          animate={mounted ? { opacity: [0, 1], y: [16, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-2 text-white/70 text-[10px] md:text-xs tracking-[0.24em] uppercase"
        >
          Multan Atelier | Since 2023
        </motion.p>

        <motion.div
          initial={false}
          animate={mounted ? { opacity: [0, 1], y: [10, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-5 flex items-center justify-center gap-2 md:gap-3"
        >
          <span className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/75 text-[10px] tracking-[0.18em] uppercase font-semibold">
            Handcrafted Finish
          </span>
          <span className="px-3 py-1.5 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#F4CE5C] text-[10px] tracking-[0.18em] uppercase font-semibold">
            Premium Comfort
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={mounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-6 md:pb-10 mt-auto"
      >
        <div className="bg-[#121A2F]/62 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1.2fr_0.9fr] gap-8 items-center shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
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