'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Award, Users, Globe } from 'lucide-react'

export default function BrandStory() {
  return (
    <section className="bg-[#0e1724] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded overflow-hidden bg-gray-900">
              <Image
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
                alt="Heritage Craftsmanship"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            {/* Est. Badge */}
            <div className="absolute -bottom-8 -right-8 bg-[#0e1724] border-4 border-[#f4cf3e] rounded-full w-36 h-36 flex flex-col items-center justify-center shadow-2xl">
              <span className="text-[#f4cf3e] text-xs tracking-[0.2em] uppercase">Est.</span>
              <span className="text-[#f4cf3e] text-4xl font-bold">1924</span>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                A Century of{' '}
                <span className="text-[#f4cf3e]">Quiet Luxury</span>
              </h2>
              <div className="w-20 h-0.5 bg-[#f4cf3e] mb-6"></div>
            </div>

            <p className="text-white/60 text-base leading-relaxed">
              For four generations, the Bianchi & Berluti families have preserved
              the art of Italian shoemaking. Every pair of shoes undergoes 180 individual
              man-hours shaping the finest hides—all just to meet our exacting standards.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#f4cf3e]/10 rounded-full">
                  <Award className="text-[#f4cf3e]" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">
                    Ethically sourced & grain leathers
                  </h3>
                  <p className="text-white/50 text-xs">
                    Premium materials from sustainable sources
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#f4cf3e]/10 rounded-full">
                  <Users className="text-[#f4cf3e]" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">
                    Hand-sourced goatskin leather
                  </h3>
                  <p className="text-white/50 text-xs">
                    Carefully selected by master craftsmen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#f4cf3e]/10 rounded-full">
                  <Globe className="text-[#f4cf3e]" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">
                    Unbeatable craftsmanship & guarantee
                  </h3>
                  <p className="text-white/50 text-xs">
                    Lifetime warranty on all artisan pieces
                  </p>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-3 px-6 py-3 bg-transparent border border-[#f4cf3e] text-[#f4cf3e] font-bold text-xs tracking-[0.15em] uppercase hover:bg-[#f4cf3e] hover:text-[#0e1724] transition-all group mt-8">
              Our Heritage Story
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
