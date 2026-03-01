'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0B101E] pt-24 pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-120px)]">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-8"
          >
            <div className="space-y-4">
              <p className="text-[#D4AF37] text-[10px] tracking-[0.25em] uppercase font-bold">
                The 2024 Collection
              </p>
              
              {/* Added font-serif to give it that premium, elegant look from the image */}
              <h1 className="text-6xl md:text-7xl lg:text-[90px] font-serif font-bold text-[#D4AF37] leading-[0.95] tracking-tight">
                Pure
                <br />
                Artistry
              </h1>
              
              <p className="text-white/70 text-sm max-w-[360px] leading-relaxed pt-2">
                Redefining luxury footwear through centuries of craftsmanship and modern Italian design.
              </p>
            </div>

            {/* Buttons updated to rounded-full (pill shape) to match image */}
            <div className="flex gap-4 pt-10">
              <button className="px-8 py-3 bg-[#D4AF37] text-[#0B101E] text-xs font-bold tracking-[0.15em] uppercase rounded-full hover:bg-white transition-all">
                Shop Now
              </button>
              <button className="px-8 py-3 border border-white/20 text-white text-xs font-bold tracking-[0.15em] uppercase rounded-full hover:border-white hover:bg-white hover:text-[#0B101E] transition-all">
                View Film
              </button>
            </div>
          </motion.div>

          {/* Right Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              {/* Background box slightly tilted anti-clockwise (-rotate-6) like the image */}
              <div className="absolute inset-8 bg-[#121A2F] rounded-sm shadow-2xl transform -rotate-6 border border-white/5"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[90%] h-[90%] transform -rotate-2">
                  <Image
                    src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80"
                    alt="Premium Red Boot"
                    fill
                    className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
