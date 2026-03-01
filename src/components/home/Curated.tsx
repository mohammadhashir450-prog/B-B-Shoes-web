'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const items = [
  {
    title: "The Gentlemen's Heritage",
    subtitle: "Masterpieces for the modern man",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80",
    size: "large"
  },
  {
    title: "Elegance",
    subtitle: "Crafted for grace",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    size: "large"
  },
  {
    title: "Junior Love",
    subtitle: "Premium kids collection",
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80",
    size: "small"
  },
  {
    title: "The Atelier",
    subtitle: "Premium care collection",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    size: "small"
  }
]

export default function Curated() {
  return (
    <section className="bg-[#0B101E] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Curated Tastes</h2>
          <div className="w-16 h-1 bg-[#D4AF37]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group cursor-pointer overflow-hidden ${
                item.size === 'large' ? 'md:row-span-2 h-[450px]' : 'h-[215px]'
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  {item.subtitle}
                </p>
                <button className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs tracking-[0.15em] uppercase group-hover:gap-3 transition-all">
                  EXPLORE
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
