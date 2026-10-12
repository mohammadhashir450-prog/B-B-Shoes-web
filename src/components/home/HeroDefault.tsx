'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, RotateCcw } from 'lucide-react'

const HeroShoe3D = dynamic(() => import('@/components/home/HeroShoe3D'), { ssr: false })

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

const STATS = ['Free Shipping', '100% Authentic', '50K+ Clients']

export default function HeroDefault() {
  const reduce = useReducedMotion()
  const [replayKey, setReplayKey] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const anim = (d: number) => (reduce ? {} : rise(d))

  return (
    <div className="bb-hero-dark relative min-h-[100svh] overflow-hidden pb-14 pt-28 md:pb-20 md:pt-32">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[8%] h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-[#d4af37]/[0.13] blur-[150px] lg:left-[68%]" />
        <div className="absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full bg-[#b8860b]/[0.12] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.07) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at 68% 48%, #000 0%, transparent 68%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 68% 48%, #000 0%, transparent 68%)',
          }}
        />
        <span
          className="bb-hero-wordmark-dark absolute right-[-3vw] top-[14%] select-none font-serif font-black leading-none"
          aria-hidden
        >
          B&amp;B
        </span>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06080f] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-4 px-5 sm:px-8 md:px-10 lg:grid-cols-[0.92fr_1.08fr]">
        {/* ───────── Copy ───────── */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.div
            {...anim(0.1)}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#d4af37]/40 bg-white/[0.05] px-4 py-2 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e2bd52] shadow-[0_0_10px_#e2bd52]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e9d9a8] md:text-[11px]">
              B&amp;B Signature
            </span>
          </motion.div>

          <motion.h1
            {...anim(0.2)}
            className="!text-[#f8f2e4] text-[3.1rem] font-bold leading-[0.98] tracking-[-0.03em] sm:text-[4.2rem] md:text-[5.2rem] xl:text-[6.3rem]"
          >
            Step Into
            <br />
            <span className="bb-gold-text italic">Quiet Power.</span>
          </motion.h1>

          <motion.p {...anim(0.34)} className="mx-auto mt-6 max-w-[420px] text-[15px] tracking-wide text-[#b9b2a0] md:text-[17px] lg:mx-0">
            Premium footwear, delivered across Pakistan.
          </motion.p>

          <motion.div {...anim(0.46)} className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <Link
              href="/collections#all-products-grid"
              className="bb-hero-cta group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-9 py-4 text-[12px] font-extrabold uppercase tracking-[0.2em] !text-[#0b0c10]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Explore Collection</span>
              <ArrowRight size={15} className="relative transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/new-arrivals"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.04] px-9 py-4 text-[12px] font-bold uppercase tracking-[0.2em] !text-[#f8f2e4] backdrop-blur transition-all hover:border-[#d4af37] hover:bg-white/10"
            >
              New Arrivals
            </Link>
          </motion.div>

          <motion.ul
            {...anim(0.6)}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
          >
            {STATS.map((s, i) => (
              <li key={s} className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#9a937f] md:text-[11px]">
                {s}
                {i < STATS.length - 1 && <span className="h-1 w-1 rounded-full bg-[#d4af37]" />}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ───────── 3D stage ───────── */}
        <motion.div
          {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.2 } })}
          className="order-1 lg:order-2"
        >
          <div className="relative mx-auto h-[380px] w-full max-w-[720px] sm:h-[480px] md:h-[580px] lg:h-[700px]">
            <div className="pointer-events-none absolute left-1/2 top-[46%] h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,214,120,0.34)_0%,rgba(212,175,55,0.12)_45%,transparent_70%)]" />
            <div className="bb-orbit pointer-events-none absolute left-1/2 top-[46%] h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#d4af37]/30" />

            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37]" />
              </div>
            )}

            <div className="absolute inset-0">
              <HeroShoe3D replayKey={replayKey} onLoaded={() => setLoaded(true)} />
            </div>

            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              style={{ background: 'rgba(0,0,0,0.6)' }}
              className="absolute bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#d4af37]/45 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] !text-[#e9d9a8] backdrop-blur transition hover:border-[#d4af37]"
              aria-label="Replay shoe drop animation"
            >
              <RotateCcw size={12} /> Replay
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
