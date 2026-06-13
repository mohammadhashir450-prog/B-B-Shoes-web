'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Instagram, ArrowUpRight } from 'lucide-react'

export default function InstagramBanner() {
  const shouldReduceMotion = useReducedMotion()

  const instagramPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
      alt: 'Luxury leather shoes on Instagram',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
      alt: 'Premium sneakers on Instagram',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      alt: 'Classic red sports shoe on Instagram',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80',
      alt: 'Minimalist white shoes on Instagram',
    },
  ]

  return (
    <section className="relative bg-[#18202B] py-16 md:py-24 overflow-hidden border-t border-white/5">
      {/* Decorative premium gold radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-[#D4AF37]/4 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left Block - Editorial CTA */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Instagram size={12} className="text-[#D4AF37]" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#D4AF37]">
                  Stay Connected
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white leading-tight">
                Join the B&B Family on Instagram
              </h2>
              <p className="text-lg text-[#D4AF37]/90 font-medium tracking-wide">
                @bandbshoes_pk
              </p>
            </div>

            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-[540px]">
              Step behind the scenes of premium footwear craftsmanship. Follow us for styling tips, 
              first access to limited collections, and updates from the workshop.
            </p>

            <div>
              <a
                href="https://www.instagram.com/bandbshoes_pk/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-4 bg-[#D4AF37] hover:bg-[#C5A030] text-[#18202B] text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_36px_rgba(212,175,55,0.35)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Visit Instagram Profile</span>
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>

          {/* Right Block - Visual Grid */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href="https://www.instagram.com/bandbshoes_pk/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <Instagram size={28} className="text-white" />
                    <span className="text-[10px] tracking-widest text-white/80 font-bold uppercase">
                      View Post
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
