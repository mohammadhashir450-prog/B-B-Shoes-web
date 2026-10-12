'use client'

import { useEffect, useRef, useState } from 'react'
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
  const rootRef = useRef<HTMLDivElement>(null)
  const [replayKey, setReplayKey] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const anim = (d: number) => (reduce ? {} : rise(d))

  // Replay the drop / untie → tie sequence every time the hero scrolls back into view.
  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    let wasOut = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.12) wasOut = true
        else if (wasOut && entry.intersectionRatio > 0.45) {
          wasOut = false
          setReplayKey((k) => k + 1)
        }
      },
      { threshold: [0, 0.12, 0.3, 0.45, 0.6] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="bb-hero-dark relative min-h-[100svh] overflow-hidden">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[34%] h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/[0.14] blur-[160px]" />
        <div className="absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full bg-[#b8860b]/[0.12] blur-[140px]" />
        <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-[#b8860b]/[0.1] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.07) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at 50% 52%, #000 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 52%, #000 0%, transparent 70%)',
          }}
        />
        <div className="bb-orbit absolute left-1/2 top-[52%] h-[min(120vw,980px)] w-[min(120vw,980px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#d4af37]/20" />
      </div>

      {/* Giant headline sits BEHIND the shoe */}
      <div className="pointer-events-none absolute inset-x-0 top-[13%] z-[1] px-4 text-center md:top-[11%]">
        <motion.p
          {...anim(0.1)}
          className="mb-3 text-[10px] font-bold uppercase tracking-[0.5em] text-[#e2bd52] md:mb-5 md:text-[12px]"
        >
          B&amp;B Signature
        </motion.p>
        <motion.h1
          {...anim(0.2)}
          className="!text-[#f8f2e4] text-[3.1rem] font-bold leading-[0.92] tracking-[-0.035em] sm:text-[5rem] md:text-[7rem] xl:text-[8.5rem]"
        >
          Step Into
          <br />
          <span className="bb-gold-text italic">Quiet Power.</span>
        </motion.h1>
      </div>

      {/* The shoe owns the WHOLE section */}
      <motion.div
        {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.2 } })}
        className="absolute inset-0 z-[5]"
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37]" />
          </div>
        )}
        <HeroShoe3D replayKey={replayKey} onLoaded={() => setLoaded(true)} />
      </motion.div>

      {/* Bottom call-to-action row */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[10] flex flex-col items-center px-5 pb-8 md:pb-10">
        <motion.div
          {...anim(0.5)}
          className="pointer-events-auto flex w-full max-w-[520px] flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center"
        >
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
            className="inline-flex items-center justify-center rounded-full border border-white/25 px-9 py-4 text-[12px] font-bold uppercase tracking-[0.2em] !text-[#f8f2e4] backdrop-blur transition-all hover:border-[#d4af37]"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            New Arrivals
          </Link>
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="pointer-events-auto hidden items-center gap-2 rounded-full border border-[#d4af37]/40 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] !text-[#e9d9a8] transition hover:border-[#d4af37] sm:inline-flex"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            aria-label="Replay shoe drop animation"
          >
            <RotateCcw size={13} /> Replay
          </button>
        </motion.div>

        <motion.ul {...anim(0.65)} className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {STATS.map((s, i) => (
            <li key={s} className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#9a937f] md:text-[11px]">
              {s}
              {i < STATS.length - 1 && <span className="h-1 w-1 rounded-full bg-[#d4af37]" />}
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-44 bg-gradient-to-t from-[#06080f] via-[#06080f]/70 to-transparent" />
    </div>
  )
}
