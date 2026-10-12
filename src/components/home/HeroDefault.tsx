'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, RotateCcw, ShieldCheck, Truck, Sparkles, MousePointer2 } from 'lucide-react'

const HeroShoe3D = dynamic(() => import('@/components/home/HeroShoe3D'), { ssr: false })

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function HeroDefault() {
  const reduce = useReducedMotion()
  const [replayKey, setReplayKey] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const anim = (d: number) => (reduce ? {} : rise(d))

  return (
    <div className="bb-hero relative min-h-[100svh] overflow-hidden pt-28 md:pt-32 pb-16 md:pb-20">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[620px] w-[620px] rounded-full bg-[#d4af37]/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-48 h-[680px] w-[680px] rounded-full bg-[#b8860b]/10 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(169,122,24,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(169,122,24,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at 70% 45%, #000 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 70% 45%, #000 0%, transparent 70%)',
          }}
        />
        {/* oversized outlined wordmark */}
        <span
          className="bb-hero-wordmark absolute right-[-2vw] top-[16%] select-none font-serif font-black leading-none"
          aria-hidden
        >
          B&amp;B
        </span>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-6 px-5 sm:px-8 md:px-10 lg:grid-cols-[1.02fr_1fr] lg:gap-4">
        {/* ───────── Copy ───────── */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.div {...anim(0.05)} className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#d4af37]/40 bg-white/70 px-4 py-2 shadow-[0_8px_30px_-14px_rgba(169,122,24,0.5)] backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4af37] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b8860b]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#18202B] md:text-[11px]">
              B&amp;B Signature Footwear · Since 2023
            </span>
          </motion.div>

          <motion.h1
            {...anim(0.15)}
            className="text-[2.7rem] font-bold leading-[1.02] tracking-[-0.025em] text-[#121821] sm:text-[3.5rem] md:text-[4.4rem] xl:text-[5.4rem]"
          >
            Walk Into
            <br />
            <span className="bb-gold-text italic">Quiet Power.</span>
          </motion.h1>

          <motion.p
            {...anim(0.28)}
            className="mx-auto mt-6 max-w-[520px] text-[15px] leading-relaxed text-[#566070] md:text-[17px] lg:mx-0"
          >
            Handpicked premium footwear crafted for comfort, confidence and everyday elegance —
            delivered to your door anywhere in Pakistan.
          </motion.p>

          <motion.div {...anim(0.4)} className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <Link
              href="/collections#all-products-grid"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#121821] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] !text-white shadow-[0_18px_40px_-16px_rgba(18,24,33,0.7)] transition-transform hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Explore Collection</span>
              <ArrowRight size={15} className="relative transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/new-arrivals"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#121821]/25 bg-white/70 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#121821] backdrop-blur transition-all hover:border-[#d4af37] hover:bg-white"
            >
              New Arrivals
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.ul
            {...anim(0.55)}
            className="mx-auto mt-10 grid max-w-[540px] grid-cols-3 gap-3 lg:mx-0"
          >
            {[
              { icon: Truck, title: 'Free Shipping', sub: 'Pakistan wide' },
              { icon: ShieldCheck, title: '100% Authentic', sub: 'Quality assured' },
              { icon: Sparkles, title: '50K+ Clients', sub: 'Trusted & loved' },
            ].map(({ icon: Icon, title, sub }) => (
              <li
                key={title}
                className="rounded-2xl border border-[#ece4d3] bg-white/80 px-3 py-3.5 text-center shadow-[0_10px_30px_-20px_rgba(18,24,33,0.35)] backdrop-blur lg:text-left"
              >
                <Icon size={18} className="mx-auto mb-2 text-[#a97a18] lg:mx-0" strokeWidth={1.8} />
                <p className="text-[11px] font-bold leading-tight text-[#121821] md:text-xs">{title}</p>
                <p className="mt-0.5 text-[10px] text-[#7a8492] md:text-[11px]">{sub}</p>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ───────── 3D stage ───────── */}
        <motion.div {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 } })} className="order-1 lg:order-2">
          <div className="relative mx-auto h-[340px] w-full max-w-[640px] sm:h-[440px] md:h-[520px] lg:h-[640px]">
            {/* spotlight disc */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,236,170,0.9)_0%,rgba(212,175,55,0.28)_45%,transparent_70%)] blur-[2px]" />
            <div className="bb-orbit pointer-events-none absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#d4af37]/45" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[64%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4af37]/25" />

            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37]" />
              </div>
            )}

            <div className="absolute inset-0">
              <HeroShoe3D replayKey={replayKey} onLoaded={() => setLoaded(true)} />
            </div>

            {/* floating glass chips */}
            <div className="bb-float pointer-events-none absolute left-0 top-[18%] hidden rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-[0_20px_45px_-22px_rgba(18,24,33,0.5)] backdrop-blur-md sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a97a18]">Craft</p>
              <p className="text-sm font-semibold text-[#121821]">Premium materials</p>
            </div>
            <div className="bb-float-slow pointer-events-none absolute bottom-[16%] right-0 hidden rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-[0_20px_45px_-22px_rgba(18,24,33,0.5)] backdrop-blur-md sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a97a18]">Comfort</p>
              <p className="text-sm font-semibold text-[#121821]">All-day cushioning</p>
            </div>

            <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-3">
              <span className="hidden items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#566070] backdrop-blur sm:inline-flex">
                <MousePointer2 size={12} /> Drag to rotate
              </span>
              <button
                type="button"
                onClick={() => setReplayKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/50 bg-white/85 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#121821] backdrop-blur transition hover:bg-white"
                aria-label="Replay shoe drop animation"
              >
                <RotateCcw size={12} className="text-[#a97a18]" /> Replay
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#7a8492] md:flex">
        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Scroll</span>
        <span className="relative h-8 w-[1.5px] overflow-hidden rounded-full bg-[#d4af37]/30">
          <span className="bb-scroll-dot absolute left-0 top-0 h-3 w-full rounded-full bg-[#a97a18]" />
        </span>
      </div>
    </div>
  )
}
