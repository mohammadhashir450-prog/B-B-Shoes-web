'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-white overflow-hidden pt-24 md:pt-28 pb-16 md:pb-24" suppressHydrationWarning>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,#ffffff_0%,#FCFCFC_58%,#ffffff_100%)]" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10">
        <motion.div
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55 }}
          className="text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#D7DCE2] bg-white mb-10">
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.22em] text-[#111827] uppercase">
              B&B Signature Footwear
            </span>
          </div>

          <h1 className="text-[2.35rem] sm:text-[2.8rem] md:text-[5.8rem] lg:text-[8rem] leading-[0.9] tracking-[-0.045em] font-black text-[#06080F] max-w-[1100px] mx-auto">
            Quiet Power.
          </h1>

          <p className="mt-8 text-sm md:text-base text-[#374151] max-w-[440px] mx-auto leading-relaxed tracking-[0.08em] uppercase">
            Crafted for presence.
          </p>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 w-full max-w-[520px] mx-auto">
            <Link
              href="/collections#all-products-grid"
              className="group inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 md:px-7 py-3 rounded-full bg-[#06080F] !text-white text-xs md:text-sm font-bold tracking-[0.14em] uppercase hover:bg-[#161B26] transition-colors"
            >
              All Products
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/new-arrivals"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 md:px-7 py-3 rounded-full border-2 border-[#06080F] bg-white text-[#06080F] text-xs md:text-sm font-bold tracking-[0.14em] uppercase hover:bg-[#06080F] hover:text-white transition-all"
            >
              New Arrivals
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="relative mt-20 md:mt-24"
        >
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-[82%] h-24 bg-[#111827]/8 blur-3xl rounded-full" />

          <div className="relative rounded-[2rem] md:rounded-[2.5rem] border border-[#D8DEE6] bg-white p-3 md:p-4 shadow-[0_30px_80px_-30px_rgba(6,8,15,0.42)]">
            <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] h-[380px] md:h-[560px] lg:h-[640px]">
              <motion.div
                initial={false}
                animate={
                  mounted && !shouldReduceMotion
                    ? { scale: [1.02, 1.04, 1.02], y: [0, -4, 0] }
                    : { scale: 1.02, y: 0 }
                }
                transition={{ duration: 24, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <Image
                  src="https://res.cloudinary.com/dt2ikjlfc/image/upload/v1775127417/bb-shoes/hero/hero-purple-sandals.jpg"
                  alt="B&B Premium Stylish Sandals"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                  unoptimized
                />
              </motion.div>
            </div>
          </div>

          <div className="mt-7 md:mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-10 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[#374151]">
            <span>50K+ Clients</span>
            <span className="w-1 h-1 rounded-full bg-[#9CA3AF]" />
            <span>100% Authentic</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}