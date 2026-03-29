'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, Tag, Grid, ChevronLeft, ChevronRight } from 'lucide-react'

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
  const [activeIndex, setActiveIndex] = useState(0)

  const currentItem = useMemo(() => items[activeIndex], [activeIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }

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
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous curated slide"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DCCFB6] bg-white text-[#253041] hover:border-[#D4AF37] hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next curated slide"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DCCFB6] bg-white text-[#253041] hover:border-[#D4AF37] hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>

        <div className="relative rounded-2xl overflow-hidden border border-[#E7DECF] shadow-[0_18px_34px_-22px_rgba(24,32,43,0.35)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            >
              <Link href={currentItem.link} className="group block">
                <div className="relative h-[300px] sm:h-[360px] md:h-[430px] bg-[#F7F2E8]">
                  <Image
                    src={currentItem.image}
                    alt={currentItem.title}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <motion.div
                    aria-hidden
                    animate={{ x: [0, 22, -16, 0], y: [0, -12, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-white/35 via-[#D4AF37]/20 to-transparent blur-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06080F]/62 via-[#06080F]/20 to-transparent" />

                  <div className="absolute left-4 sm:left-6 right-4 sm:right-6 bottom-4 sm:bottom-6">
                    <p className="text-[#D4AF37] text-[10px] tracking-[0.18em] uppercase font-bold flex items-center gap-2">
                      <currentItem.icon size={12} /> {currentItem.subtitle}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-serif font-black leading-tight">
                        {currentItem.title}
                      </h3>
                      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#18202B] transition-colors">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to ${item.title}`}
                className={`h-1.5 rounded-full transition-all ${activeIndex === idx ? 'w-6 bg-[#D4AF37]' : 'w-3 bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}