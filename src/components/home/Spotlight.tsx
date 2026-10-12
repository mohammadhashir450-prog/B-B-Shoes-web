'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Gem, Hammer, ShieldCheck } from 'lucide-react'

const POINTS = [
  { icon: Hammer, title: 'Hand-burnished' },
  { icon: Gem, title: 'Solid brass buckles' },
  { icon: ShieldCheck, title: 'Built to last' },
]

const HOTSPOTS = [
  { left: '33%', top: '57%' },
  { left: '69%', top: '67%' },
]

export default function Spotlight() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // Replays every time the section scrolls back into view (once: false)
  const inView = useInView(sectionRef, { amount: 0.4 })

  // Mouse-driven 3D tilt
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotY = useSpring(useTransform(mx, [-1, 1], [-16, 16]), { stiffness: 120, damping: 14 })
  const rotX = useSpring(useTransform(my, [-1, 1], [12, -12]), { stiffness: 120, damping: 14 })
  const shine = useTransform(
    mx,
    (v) => `radial-gradient(circle at ${50 + v * 40}% 30%, rgba(255,255,255,0.55), transparent 45%)`
  )

  const onMove = (e: React.PointerEvent) => {
    const r = stageRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const show = inView || reduce

  return (
    <section ref={sectionRef} className="bb-spotlight relative overflow-hidden py-20 md:py-28">
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[44%] h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/[0.15] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at 50% 46%, #000 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 46%, #000 0%, transparent 70%)',
          }}
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-[6%] -translate-x-1/2 select-none whitespace-nowrap font-serif font-black leading-none"
          style={{
            fontSize: 'clamp(5rem, 21vw, 21rem)',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(212,175,55,0.16)',
            letterSpacing: '-0.03em',
          }}
        >
          FORMAL
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 text-center sm:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-4 text-[11px] font-bold uppercase tracking-[0.5em] text-[#e2bd52]"
        >
          Signature
        </motion.p>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="!text-[#f8f2e4] text-[2.8rem] font-bold leading-[1] tracking-[-0.03em] sm:text-6xl md:text-7xl"
        >
          The <span className="bb-gold-text italic">Formal</span> Edit.
        </motion.h2>

        {/* 3D stage */}
        <div
          ref={stageRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative mx-auto mt-8 w-full max-w-[720px] md:mt-10"
          style={{ perspective: 1300 }}
        >
          {/* podium glow + rings */}
          <div className="pointer-events-none absolute inset-x-[8%] bottom-[2%] h-[18%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(212,175,55,0.5)_0%,transparent_70%)] blur-xl" />
          <motion.div
            animate={inView ? { scale: [0.6, 1.25], opacity: [0.9, 0] } : { opacity: 0 }}
            transition={{ duration: 1.4, delay: 1.05, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-x-[4%] bottom-[4%] h-[16%] rounded-[50%] border-2 border-[#e2bd52]"
          />
          <div className="pointer-events-none absolute inset-x-[6%] bottom-[3%] h-[16%] rounded-[50%] border border-[#d4af37]/55 shadow-[0_0_40px_rgba(212,175,55,0.35)]" />

          {/* The shoes: drop in from above, tilt with the cursor */}
          <motion.div
            initial={reduce ? false : { y: -520, rotate: -14, opacity: 0 }}
            animate={show ? { y: 0, rotate: 0, opacity: 1 } : { y: -520, rotate: -14, opacity: 0 }}
            transition={
              show
                ? { type: 'spring', stiffness: 90, damping: 9, mass: 1.1, opacity: { duration: 0.25 } }
                : { duration: 0.3 }
            }
            className="relative"
          >
            <motion.div
              style={reduce ? undefined : { rotateX: rotX, rotateY: rotY }}
              className="relative"
            >
              {/* lit plate that the studio shot sits on */}
              <div className="absolute inset-[1%] rounded-full bg-[radial-gradient(circle,#f6ebcf_0%,#e6d09a_55%,#b8923c_100%)] shadow-[0_0_90px_rgba(212,175,55,0.35),inset_0_0_50px_rgba(255,244,214,0.5)]" />
              <div className="absolute inset-[1%] rounded-full border-2 border-[#f3dc92]/80" />

              <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
                <Image
                  src="/images/image.png"
                  alt="Hand-finished tan leather double monk strap shoes"
                  fill
                  sizes="(max-width: 768px) 92vw, 720px"
                  quality={95}
                  className="scale-[1.02] object-contain mix-blend-multiply drop-shadow-[0_40px_30px_rgba(60,38,6,0.45)] [mask-image:radial-gradient(closest-side,#000_80%,transparent_97%)] [filter:contrast(1.08)_brightness(1.02)_saturate(1.08)]"
                />
                {/* travelling highlight */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                  style={{ background: shine }}
                />
              </div>

              {HOTSPOTS.map((h, i) => (
                <motion.span
                  key={i}
                  initial={reduce ? false : { opacity: 0, scale: 0.3 }}
                  animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
                  transition={{ delay: 1.1 + i * 0.2, type: 'spring', stiffness: 220, damping: 12 }}
                  className="absolute z-10 flex h-5 w-5 items-center justify-center"
                  style={{ left: h.left, top: h.top }}
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4af37]/70" />
                  <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-[#a97a18]" />
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* points + CTA */}
        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {POINTS.map(({ icon: Icon, title }) => (
            <li
              key={title}
              className="flex items-center gap-2.5 rounded-full border border-[#d4af37]/35 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f1e6c8] backdrop-blur"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <Icon size={15} className="text-[#e2bd52]" />
              {title}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-9"
        >
          <Link
            href="/formal"
            className="bb-hero-cta group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-10 py-4 text-[12px] font-extrabold uppercase tracking-[0.2em] !text-[#0b0c10]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Shop Formal</span>
            <ArrowRight size={15} className="relative transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
