'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Load canvas only client-side (no SSR for WebGL)
const ShoeScene = dynamic(() => import('@/components/3d/ShoeScene'), { ssr: false })

// ─── Scroll Sections ───────────────────────────────────────────────
const SECTIONS = [
  {
    badge:    'Performance',
    heading:  'BUILT FOR\nMORE.',
    sub:      'Where raw energy meets precision engineering. Every stitch, every sole — crafted for champions.',
    accent:   '#D4AF37',
  },
  {
    badge:    'Comfort',
    heading:  'FEELS LIKE\nNOTHING.',
    sub:      'Cloud-cushion foam technology adapts to your stride. Zero break-in period — ready from step one.',
    accent:   '#818CF8',
  },
  {
    badge:    'Design',
    heading:  'WEAR THE\nFUTURE.',
    sub:      'Inspired by aerospace aesthetics. A silhouette so clean it belongs in a gallery — or a race.',
    accent:   '#34D399',
  },
]

export default function SneakerShowcasePage() {
  const scrollProgress = useRef(0)
  const containerRef   = useRef<HTMLDivElement>(null)
  const headingRefs    = useRef<(HTMLDivElement | null)[]>([])
  const canvasWrapRef  = useRef<HTMLDivElement>(null)
  const activeDotRefs  = useRef<(HTMLButtonElement | null)[]>([])

  // ── GSAP scroll setup ──────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Drive scrollProgress 0→1 over the full scroll distance
      ScrollTrigger.create({
        trigger: containerRef.current,
        start:   'top top',
        end:     'bottom bottom',
        onUpdate: (self) => {
          scrollProgress.current = self.progress
        },
      })

      // Per-section text animations
      SECTIONS.forEach((_, i) => {
        const el = headingRefs.current[i]
        if (!el) return

        // Entrance
        gsap.fromTo(
          el,
          { opacity: 0, y: 60, filter: 'blur(8px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start:   'top 80%',
              end:     'top 40%',
              scrub:   false,
              toggleActions: 'play none none reverse',
            },
          },
        )

        // Highlight nav dot
        ScrollTrigger.create({
          trigger: el.closest('.section-panel'),
          start:   'top 60%',
          end:     'bottom 60%',
          onEnter:     () => setActiveDot(i),
          onEnterBack: () => setActiveDot(i),
        })
      })

      // Canvas sticky glow pulse
      gsap.to(canvasWrapRef.current, {
        boxShadow: '0 0 120px 40px rgba(212,175,55,0.18)',
        yoyo: true,
        repeat: -1,
        duration: 3,
        ease: 'sine.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const setActiveDot = (index: number) => {
    activeDotRefs.current.forEach((dot, i) => {
      if (!dot) return
      dot.style.opacity = i === index ? '1' : '0.3'
      dot.style.transform = i === index ? 'scale(1.4)' : 'scale(1)'
    })
  }

  const scrollToSection = (i: number) => {
    const el = document.querySelectorAll('.section-panel')[i]
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={containerRef} className="relative bg-[#06080F] text-white">

      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-xl font-black tracking-[0.15em] text-white">KICKX</span>
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">
          {['Home','Men','Women','New Arrivals','Collections'].map(l => (
            <Link key={l} href="/" className="hover:text-white transition-colors">{l}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-white/70">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      </header>

      {/* ── Sticky Canvas ─────────────────────────────────────────── */}
      <div
        ref={canvasWrapRef}
        className="sticky top-0 h-screen w-full z-10 pointer-events-none"
        style={{ borderRadius: '0' }}
      >
        {/* Noise grain overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'
        }} />

        {/* Radial glow behind shoe */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
          />
        </div>

        {/* R3F Canvas */}
        <div className="absolute inset-0 pointer-events-auto">
          <ShoeScene scrollProgress={scrollProgress} />
        </div>
      </div>

      {/* ── Scroll Sections ─────────────────────────────────────────── */}
      {SECTIONS.map((section, i) => (
      <section
          key={i}
          className="section-panel relative min-h-screen flex items-center z-20"
          style={{ marginTop: i === 0 ? '-100vh' : '0' }}
        >
          <div
            ref={el => { headingRefs.current[i] = el }}
            className={`max-w-[1320px] mx-auto w-full px-8 md:px-16 ${
              i % 2 === 0 ? 'text-left' : 'text-right ml-auto'
            }`}
          >
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 mb-6 ${i % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
              <div className="w-2 h-2 rounded-full" style={{ background: section.accent, boxShadow: `0 0 8px ${section.accent}` }} />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: section.accent }}>
                {section.badge}
              </span>
            </div>

            {/* Main heading */}
            <h2
              className="text-[clamp(3rem,10vw,9rem)] leading-[0.88] font-black tracking-[-0.04em] text-white mb-8"
              style={{ whiteSpace: 'pre-line' }}
            >
              {section.heading}
            </h2>

            {/* Sub */}
            <p className={`text-white/50 text-base md:text-lg max-w-[420px] leading-relaxed ${i % 2 !== 0 ? 'ml-auto' : ''}`}>
              {section.sub}
            </p>

            {/* CTA — only on first section */}
            {i === 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-[0.12em] uppercase transition-all"
                  style={{ background: section.accent, color: '#06080F' }}
                >
                  Shop Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link
                  href="/bag"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-[0.12em] uppercase border-2 text-white transition-all hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  Add to Cart
                </Link>
              </div>
            )}

            {/* Scroll hint — only on first section */}
            {i === 0 && (
              <div className="mt-20 flex items-center gap-3 opacity-40">
                <div className="w-6 h-9 rounded-full border border-white/30 flex items-start justify-center p-1.5">
                  <div className="w-1 h-2 rounded-full bg-white animate-bounce" />
                </div>
                <span className="text-[10px] tracking-[0.25em] uppercase">Scroll to explore</span>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ── Section Progress Dots ────────────────────────────────────── */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[300] flex flex-col gap-3">
        {SECTIONS.map((_, i) => (
          <button
            key={i}
            ref={el => { activeDotRefs.current[i] = el }}
            onClick={() => scrollToSection(i)}
            aria-label={`Go to section ${i + 1}`}
            className="w-2 h-2 rounded-full bg-white transition-all duration-300"
            style={{ opacity: i === 0 ? 1 : 0.3, transform: i === 0 ? 'scale(1.4)' : 'scale(1)' }}
          />
        ))}
      </div>

      {/* ── Footer strip ─────────────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-white/[0.06] py-8 px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xl font-black tracking-[0.15em]">KICKX</span>
        <p className="text-[11px] text-white/30 tracking-[0.15em] uppercase">
          © {new Date().getFullYear()} B&amp;B Shoes · All rights reserved
        </p>
        <div className="flex items-center gap-6 text-[11px] text-white/40 tracking-[0.12em] uppercase">
          <Link href="/collections">Shop</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
