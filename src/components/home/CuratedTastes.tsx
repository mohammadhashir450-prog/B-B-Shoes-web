'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    title: "The Gentlemen's Heritage",
    subtitle: "Masterpieces for the modern man",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    link: "/collections/gentlemen",
    size: "large"
  },
  {
    title: "Elegance",
    subtitle: "Crafted for grace",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    link: "/collections/elegance",
    size: "large"
  },
  {
    title: "Junior Love",
    subtitle: "Premium kids collection",
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80",
    link: "/collections/junior",
    size: "small"
  },
  {
    title: "The Atelier",
    subtitle: "Premium care collection",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    link: "/collections/atelier",
    size: "small"
  }
]

export default function CuratedTastes() {
  return (
    <section className="bg-[#0e1724] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Curated Tastes
          </h2>
          <div className="w-20 h-0.5 bg-[#f4cf3e]"></div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group cursor-pointer overflow-hidden rounded ${
                category.size === 'large' ? 'md:row-span-2 h-[420px]' : 'h-[200px]'
              }`}
            >
              {/* Background Image */}
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  {category.subtitle}
                </p>
                <button className="flex items-center gap-2 text-[#f4cf3e] font-semibold text-sm tracking-wider uppercase group-hover:gap-3 transition-all">
                  Explore
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
