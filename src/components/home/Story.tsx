'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Story() {
  return (
    <section className="bg-white py-20">
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
            <div className="relative aspect-[4/5] overflow-hidden bg-white">
              <Image
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
                alt="Craftsmanship"
                fill
                className="object-cover grayscale-[20%]"
              />
            </div>
            
            {/* Est Badge */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white border-4 border-[#D4AF37] rounded-full flex flex-col items-center justify-center shadow-[0_18px_35px_-20px_rgba(24,32,43,0.35)]">
              <span className="text-[#D4AF37] text-[9px] tracking-widest uppercase">Est.</span>
              <span className="text-[#A97A18] text-3xl font-bold">2023</span>
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
            <h2 className="text-4xl font-bold text-[#18202B]">
              Why <span className="text-[#D4AF37]">B&B Shoes</span>
            </h2>

            <p className="text-[#4F5A69] text-base leading-relaxed">
              B&B Shoes offers premium quality footwear with comfort, durable materials,
              and clean modern styling. Each pair is selected for reliable everyday wear
              while keeping a classy luxury finish.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></div>
                <p className="text-[#253041] text-sm">
                  Ethically sourced & grain leathers
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></div>
                <p className="text-[#253041] text-sm">
                  Hand-sourced goatskin leather
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></div>
                <p className="text-[#253041] text-sm">
                  Unbeatable craftsmanship & guarantee
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
