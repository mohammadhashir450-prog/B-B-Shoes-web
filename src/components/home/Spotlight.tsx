'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Gem, Hammer, ShieldCheck } from 'lucide-react'

const POINTS = [
  { icon: Hammer, title: 'Hand-burnished leather' },
  { icon: Gem, title: 'Solid brass buckles' },
  { icon: ShieldCheck, title: 'Built to last' },
]

const HOTSPOTS = [
  { left: '34%', top: '58%', label: 'Brass buckle' },
  { left: '70%', top: '68%', label: 'Cap-toe stitching' },
  { left: '16%', top: '46%', label: 'Soft calf lining' },
]

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4])

  return (
    <section ref={ref} className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_25%_50%,rgba(212,175,55,0.16),transparent_70%)]" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 md:px-10 lg:grid-cols-2 lg:gap-20">
        {/* Visual */}
        <motion.div style={reduce ? undefined : { y }} className="relative mx-auto w-full max-w-[580px]">
          <div className="absolute inset-[6%] rounded-full border border-dashed border-[#d4af37]/50 bb-orbit" />
          <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,#fff6d8_0%,rgba(212,175,55,0.28)_55%,transparent_72%)]" />

          <motion.div style={reduce ? { aspectRatio: '1 / 1' } : { rotate, aspectRatio: '1 / 1' }} className="relative w-full">
            <Image
              src="/images/image.png"
              alt="Hand-finished tan leather double monk strap shoes"
              fill
              sizes="(max-width: 1024px) 90vw, 580px"
              quality={95}
              className="object-contain mix-blend-multiply drop-shadow-[0_40px_40px_rgba(90,58,10,0.28)] [mask-image:radial-gradient(closest-side,#000_82%,transparent_100%)] [filter:contrast(1.06)_brightness(1.03)]"
            />
          </motion.div>

          {HOTSPOTS.map((h, i) => (
            <motion.div
              key={h.label}
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.18, type: 'spring', stiffness: 220, damping: 14 }}
              className="group absolute z-10"
              style={{ left: h.left, top: h.top }}
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4af37]/60" />
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-[#a97a18] shadow" />
              </span>
              <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#121821] opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 max-sm:hidden">
                {h.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Copy */}
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-12 bg-[#d4af37]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a97a18]">Signature</p>
            </div>
            <h2 className="text-4xl font-bold leading-[1.08] text-[#121821] md:text-5xl lg:text-[3.6rem]">
              The <span className="bb-gold-text italic">Formal</span> Edit.
            </h2>
          </motion.div>

          <ul className="mt-9 space-y-3.5">
            {POINTS.map(({ icon: Icon, title }, i) => (
              <motion.li
                key={title}
                initial={reduce ? false : { opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-2xl border border-[#ece4d3] bg-white/80 p-4 shadow-[0_14px_34px_-24px_rgba(18,24,33,0.4)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#d4af37]/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3dc92] to-[#c99a2b] text-white shadow-[0_10px_20px_-10px_rgba(169,122,24,0.8)]">
                  <Icon size={19} />
                </span>
                <span className="text-[15px] font-bold text-[#121821]">{title}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <Link
              href="/formal"
              className="group inline-flex items-center gap-3 rounded-full bg-[#121821] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] !text-white shadow-[0_18px_40px_-16px_rgba(18,24,33,0.7)] transition-transform hover:-translate-y-0.5"
            >
              Shop Formal
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
