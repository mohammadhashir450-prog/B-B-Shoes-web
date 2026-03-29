'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

export default function Story() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative bg-white py-14 md:py-20 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#D4AF37]/8 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#06080F]/35 shadow-[0_24px_48px_-30px_rgba(6,8,15,0.4)] bg-[#F8F4EA]">
              <motion.div
                animate={shouldReduceMotion ? { scale: 1 } : { scale: [1, 1.04, 1] }}
                transition={{ duration: 8, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1400&q=80"
                  alt="B&B premium shoe craftsmanship"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080F]/50 via-[#06080F]/10 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8F4EA] border border-[#E8DDCA]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#A97A18]">Why B&B</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#18202B] leading-[1.1]">
              Premium Quality.
              <br />
              Trusted Brand.
            </h2>

            <p className="text-[#4F5A69] text-base leading-relaxed max-w-[560px]">
              B&B Shoes is built on premium materials, precise finishing, and comfort-first construction.
              Every pair is crafted to look sharp, feel light, and stay durable for long-term wear.
              From daily essentials to statement styles, B&B stands as a trusted name for quality footwear.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
