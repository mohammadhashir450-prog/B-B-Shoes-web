'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const pillars = [
  {
    title: 'Material Intelligence',
    detail: 'Full-grain and curated soft leathers selected for longevity, finish, and character.',
  },
  {
    title: 'Comfort Engineering',
    detail: 'Adaptive footbed balance with all-day stability tuned for city-to-event wear.',
  },
  {
    title: 'Quality Signature',
    detail: 'Every pair is reviewed through a strict visual and structural finish checklist.',
  },
]

const trustStats = [
  { value: '50K+', label: 'Pairs Delivered' },
  { value: '4.9/5', label: 'Customer Rating' },
  { value: '48h', label: 'Dispatch Window' },
]

export default function Story() {
  return (
    <section className="relative bg-white py-20 md:py-24 overflow-hidden">
      <div className="absolute -top-28 -left-24 w-[420px] h-[420px] bg-[#D4AF37]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-16 w-[360px] h-[360px] bg-[#06080F]/7 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 md:gap-16 items-center">
          {/* Editorial Visual Block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#06080F]/35 shadow-[0_38px_90px_-36px_rgba(6,8,15,0.42)]">
              <Image
                src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1400&q=80"
                alt="B&B footwear craftsmanship close-up"
                fill
                className="object-cover scale-[1.04] grayscale-[6%] contrast-110"
              />

              <motion.div
                aria-hidden
                animate={{
                  x: [0, 24, -20, 0],
                  y: [0, -16, 12, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-white/35 via-[#D4AF37]/18 to-transparent blur-3xl"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#06080F]/56 via-[#06080F]/16 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="absolute left-5 bottom-5 right-5 bg-white/95 backdrop-blur-md border border-[#E7DDCB] rounded-2xl px-4 md:px-5 py-4 shadow-[0_20px_40px_-20px_rgba(24,32,43,0.28)]"
            >
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#A97A18] font-bold">Signature Promise</p>
              <p className="text-sm md:text-base text-[#18202B] font-semibold mt-1">
                Built for statement wear. Trusted for daily comfort.
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-8 -right-6 w-36 h-36 bg-white border-4 border-[#D4AF37] rounded-full flex flex-col items-center justify-center shadow-[0_24px_45px_-20px_rgba(24,32,43,0.35)]"
            >
              <span className="text-[#D4AF37] text-[9px] tracking-widest uppercase">Est.</span>
              <span className="text-[#A97A18] text-4xl font-bold leading-none">2023</span>
              <span className="text-[#253041] text-[9px] tracking-[0.2em] uppercase mt-1">Luxury Craft</span>
            </motion.div>
          </motion.div>

          {/* Brand Narrative Block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8F4EA] border border-[#E8DDCA]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#A97A18]">Why B&B</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#18202B] leading-[1.05]">
              Designed To Be Seen.
              <br />
              Engineered To Be Worn.
            </h2>

            <p className="text-[#4F5A69] text-base leading-relaxed max-w-[560px]">
              B&B Shoes combines fashion-forward silhouettes with craft-level construction. Every pair is shaped to carry premium aesthetics, breathable comfort, and long-life performance in one refined product.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {trustStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#E8DFCF] bg-gradient-to-b from-white to-[#FBF7EE] px-3 py-4 text-center"
                >
                  <p className="text-[#18202B] text-xl md:text-2xl font-black leading-none">{stat.value}</p>
                  <p className="text-[#6A7483] text-[10px] tracking-[0.12em] uppercase mt-2">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 pt-2">
              {pillars.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-2xl border border-[#E7DECF] bg-gradient-to-r from-white to-[#FBF7EF] px-4 py-3 hover:border-[#D8C8AA] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] mt-1.5 shadow-[0_0_0_3px_rgba(212,175,55,0.2)]" />
                    <div>
                      <p className="text-[#18202B] text-sm font-semibold">{point.title}</p>
                      <p className="text-[#4F5A69] text-xs leading-relaxed mt-1">{point.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#06080F] text-white text-[11px] tracking-[0.14em] uppercase font-bold hover:bg-[#1C2330] transition-colors"
              >
                Explore Collection
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#D9C8AA] text-[#18202B] text-[11px] tracking-[0.14em] uppercase font-bold hover:bg-[#FBF7EE] transition-colors"
              >
                Discover Brand Story
              </Link>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
