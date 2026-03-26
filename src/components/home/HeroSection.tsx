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
    <section className="relative min-h-screen bg-[#090D18] overflow-hidden flex flex-col justify-end pt-28 md:pt-32" suppressHydrationWarning>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(212,175,55,0.24),transparent_43%),radial-gradient(circle_at_80%_18%,rgba(31,74,160,0.2),transparent_40%),linear-gradient(180deg,#090D18_0%,#0E1426_56%,#111C33_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:84px_84px] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center px-4 md:px-6 pb-8 md:pb-10">
        <motion.div
          initial={false}
          animate={mounted ? { opacity: [0, 1], y: [10, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease: 'easeOut' }}
          className="relative w-full max-w-[1320px]"
        >
          <div className="absolute inset-x-4 md:inset-x-8 top-8 md:top-10 h-[72%] bg-gradient-to-br from-[#D4AF37]/16 via-[#1F4AA0]/20 to-[#2E58A3]/14 blur-[80px]" />
          <div className="relative overflow-hidden rounded-[20px] shadow-[0_30px_80px_-26px_rgba(0,0,0,0.85)]">
            <motion.div
              animate={mounted ? { y: [0, -5, 0], scale: [1, 1.008, 1] } : { y: 0, scale: 1 }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
              className="relative h-[48vh] md:h-[56vh]"
            >
              <img
                src="https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=2200"
                alt="Stylish premium loafers"
                className="w-full h-full object-cover object-center saturate-125 brightness-82 contrast-115"
                loading="eager"
              />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(12,33,72,0.2),transparent_50%),linear-gradient(to_top,rgba(8,12,22,0.5),transparent_46%)] pointer-events-none" />
            </motion.div>
          </div>

          <motion.div
            initial={false}
            animate={mounted ? { opacity: [0, 1], y: [8, 0] } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 md:mt-7 flex flex-wrap items-center justify-center gap-2 relative z-30"
          >
            <span className="px-3 py-1.5 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/12 text-[#FFE39A] text-[10px] tracking-[0.18em] uppercase font-semibold">
              Luxury Craft
            </span>
            <span className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/80 text-[10px] tracking-[0.18em] uppercase font-semibold">
              Signature Comfort
            </span>
          </motion.div>

          <div className="mt-3 mb-2 text-center relative z-30">
            <p className="text-sm md:text-base tracking-[0.2em] uppercase text-[#F4F8FF] font-semibold">B&B Shoes | Since 2023</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={mounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-6 md:pb-10"
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