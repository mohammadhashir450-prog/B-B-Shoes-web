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
    <section className="relative bg-white py-16 md:py-20 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#D4AF37]/8 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#06080F]/35 shadow-[0_24px_48px_-30px_rgba(6,8,15,0.4)]">
              <Image
                src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1400&q=80"
                alt="B&B footwear craftsmanship close-up"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080F]/56 via-[#06080F]/16 to-transparent" />
            </div>

            <div className="rounded-2xl border border-[#E7DDCB] bg-[#FBF7EE] px-4 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#A97A18] font-bold">Signature Promise</p>
                <p className="text-sm text-[#18202B] font-semibold mt-1">Built for statement wear. Trusted for daily comfort.</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] tracking-[0.16em] uppercase text-[#A97A18] font-bold">Est.</p>
                <p className="text-2xl font-black text-[#18202B] leading-none">2023</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8F4EA] border border-[#E8DDCA]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#A97A18]">Why B&B</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#18202B] leading-[1.1]">
              Designed To Be Seen.
              <br />
              Engineered To Be Worn.
            </h2>

            <p className="text-[#4F5A69] text-base leading-relaxed max-w-[560px]">
              B&B Shoes combines fashion-forward silhouettes with craft-level construction. Every pair is shaped to carry premium aesthetics, breathable comfort, and long-life performance in one refined product.
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {trustStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#E8DFCF] bg-gradient-to-b from-white to-[#FBF7EE] px-2.5 py-3 text-center"
                >
                  <p className="text-[#18202B] text-lg md:text-xl font-black leading-none">{stat.value}</p>
                  <p className="text-[#6A7483] text-[9px] tracking-[0.1em] uppercase mt-1.5">{stat.label}</p>
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
                  className="rounded-xl border border-[#E7DECF] bg-gradient-to-r from-white to-[#FBF7EF] px-4 py-3"
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
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#06080F] text-white text-[10px] tracking-[0.14em] uppercase font-bold hover:bg-[#1C2330] transition-colors"
              >
                Explore Collection
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#D9C8AA] text-[#18202B] text-[10px] tracking-[0.14em] uppercase font-bold hover:bg-[#FBF7EE] transition-colors"
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
