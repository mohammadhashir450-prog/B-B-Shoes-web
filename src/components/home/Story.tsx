'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Story() {
  return (
    <section className="bg-[#0B101E] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
              <Image
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
                alt="Craftsmanship"
                fill
                className="object-cover grayscale"
              />
            </div>
            
            {/* Est Badge */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#0B101E] border-4 border-[#D4AF37] rounded-full flex flex-col items-center justify-center">
              <span className="text-[#D4AF37] text-[9px] tracking-widest uppercase">Est.</span>
              <span className="text-[#D4AF37] text-3xl font-bold">1924</span>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-white">
              A Century of <span className="text-[#D4AF37]">Quiet Luxury</span>
            </h2>

            <p className="text-gray-400 text-base leading-relaxed">
              For four generations, the Bianchi & Berluti families have preserved
              the art of Italian shoemaking. Every pair of shoes undergoes 180 individual
              man-hours shaping the finest hides—all just to meet our exacting standards.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></div>
                <p className="text-white text-sm">
                  Ethically sourced & grain leathers
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></div>
                <p className="text-white text-sm">
                  Hand-sourced goatskin leather
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></div>
                <p className="text-white text-sm">
                  Unbeatable craftsmanship & guarantee
                </p>
              </div>
            </div>

            <button className="flex items-center gap-3 px-6 py-3 border-2 border-[#D4AF37] text-[#D4AF37] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#D4AF37] hover:text-[#0B101E] transition-all group mt-6">
              OUR HERITAGE STORY
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
