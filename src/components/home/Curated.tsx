'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, Tag, Grid } from 'lucide-react'

const items = [
  {
    id: 1,
    title: 'New Arrivals',
    subtitle: 'The Vanguard Series',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1400&q=80',
    link: '/new-arrivals',
  },
  {
    id: 2,
    title: 'Sales & Discounts',
    subtitle: 'Private Insider Event',
    icon: Tag,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80',
    link: '/sales',
  },
  {
    id: 3,
    title: 'All Products',
    subtitle: 'Complete Portfolio',
    icon: Grid,
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1400&q=80',
    link: '/collections',
  },
]

export default function Curated() {
  return (
    <section className="relative bg-white py-16 md:py-20 overflow-hidden">
      <div className="absolute -top-24 -left-20 w-[420px] h-[420px] bg-[#D4AF37]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 md:mb-10"
        >
          <div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.24em] uppercase font-bold mb-3 flex items-center gap-2">
              <Sparkles size={12} /> The Archives
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#18202B] leading-tight">
              Curated Collections
            </h2>
          </div>
          <p className="text-[#4F5A69] text-sm max-w-[420px] leading-relaxed">
            Explore our highlighted categories with a cleaner browsing experience built for both desktop and mobile.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {items.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Link
                  href={item.link}
                  className="group block rounded-2xl overflow-hidden border border-[#E7DECF] bg-white shadow-[0_14px_30px_-24px_rgba(24,32,43,0.35)] hover:shadow-[0_24px_44px_-26px_rgba(24,32,43,0.45)] transition-all"
                >
                  <div className="relative aspect-[16/10] bg-[#F7F2E8]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06080F]/55 via-[#06080F]/15 to-transparent" />

                    <div className="absolute left-4 right-4 bottom-4">
                      <p className="text-[#D4AF37] text-[10px] tracking-[0.18em] uppercase font-bold flex items-center gap-2">
                        <Icon size={12} /> {item.subtitle}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <h3 className="text-white text-2xl font-serif font-black leading-tight">{item.title}</h3>
                        <span className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#18202B] transition-colors">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
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