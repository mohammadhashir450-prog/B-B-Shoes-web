'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface SeasonalBannerSummary {
  _id: string
  season: 'Summer' | 'Winter' | 'Spring' | 'Fall'
  title: string
  description?: string
  bannerImage: string
  galleryImages?: string[]
  linkUrl?: string
  discountPercent?: number
  startDate?: string
  endDate?: string
  isActive?: boolean
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [featuredBanners, setFeaturedBanners] = useState<SeasonalBannerSummary[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [nowTick, setNowTick] = useState<number>(() => Date.now())
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => { setMounted(true) }, [])

  // Tick every second — drives 100% accurate banner expiry
  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  // Fetch banners + schedule re-fetch pinned to exact banner start/end boundaries
  useEffect(() => {
    let isMounted = true
    let refreshTimer: number | null = null
    let syncInterval: number | null = null

    const clearRefreshTimer = () => {
      if (refreshTimer !== null) { window.clearTimeout(refreshTimer); refreshTimer = null }
    }

    const scheduleRefresh = (items: SeasonalBannerSummary[]) => {
      clearRefreshTimer()
      const now = Date.now()
      const transitionTimes = items
        .flatMap(item => [
          item.startDate ? new Date(item.startDate).getTime() : NaN,
          item.endDate   ? new Date(item.endDate).getTime()   : NaN,
        ])
        .filter(t => Number.isFinite(t) && t > now)
      const nextAt = transitionTimes.length > 0 ? Math.min(...transitionTimes) + 500 : now + 30_000
      refreshTimer = window.setTimeout(() => fetchBanners(), Math.max(2000, nextAt - now))
    }

    const fetchBanners = async () => {
      try {
        const res    = await fetch('/api/settings/seasonal-banners', { cache: 'no-store' })
        const result = await res.json()
        const banners: SeasonalBannerSummary[] = res.ok && Array.isArray(result?.data) ? result.data : []
        if (!isMounted) return
        setFeaturedBanners(banners)
        scheduleRefresh(banners)
      } catch {
        if (isMounted) { setFeaturedBanners([]); scheduleRefresh([]) }
      }
    }

    fetchBanners()
    syncInterval = window.setInterval(() => fetchBanners(), 15_000)

    return () => {
      isMounted = false
      clearRefreshTimer()
      if (syncInterval !== null) window.clearInterval(syncInterval)
    }
  }, [])

  // 100% accurate time-based filter — re-evaluated every second
  const activeBanners = featuredBanners.filter(banner => {
    if (banner.isActive === false) return false
    const start = banner.startDate ? new Date(banner.startDate).getTime() : Number.NEGATIVE_INFINITY
    const end   = banner.endDate   ? new Date(banner.endDate).getTime()   : Number.POSITIVE_INFINITY
    if (banner.startDate && banner.endDate) return start <= nowTick && nowTick < end
    if (banner.endDate)   return nowTick < end
    if (banner.startDate) return nowTick >= start
    return true
  })

  // Each active banner = one slide (bannerImage only, no gallery splitting)
  const heroSlides = activeBanners
    .filter(b => Boolean(b.bannerImage?.trim()))
    .map(banner => ({ id: banner._id, image: banner.bannerImage, banner }))

  // Guard slide index
  useEffect(() => {
    if (!heroSlides.length) { setCurrentSlideIndex(0); return }
    setCurrentSlideIndex(prev => (prev >= heroSlides.length ? 0 : prev))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSlides.length])

  // Auto-advance when multiple banners
  useEffect(() => {
    if (heroSlides.length <= 1 || shouldReduceMotion) return
    const t = window.setInterval(
      () => setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length),
      5000,
    )
    return () => window.clearInterval(t)
  }, [heroSlides.length, shouldReduceMotion])

  const currentSlide = heroSlides[currentSlideIndex] ?? null
  const hasBanner    = Boolean(currentSlide)

  return (
    <section className="relative overflow-hidden bg-white" suppressHydrationWarning>

      <AnimatePresence mode="wait" initial={false}>
        {hasBanner ? (

          /* ══════════════════════════════════════════════════════
             BANNER MODE — full-bleed image, zero overlays
             Navbar is fixed and floats over the top (premium look)
             ══════════════════════════════════════════════════════ */
          <motion.div
            key="banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/*
              Full-bleed banner — responsive fixed heights per breakpoint.
              Navbar is fixed/floating so no spacer needed here.
              h-[56vw]: natural proportion on any width,
              clamped between 240px (mobile) and 680px (large desktop).
            */}
            <div
              className="relative w-full overflow-hidden bg-black"
              style={{ height: 'clamp(240px, 56vw, 680px)' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide!.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentSlide!.image}
                    alt={currentSlide!.banner.title}
                    fill
                    priority
                    quality={95}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slide dots — only when multiple banners, minimal & bottom-centered */}
              {heroSlides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  {heroSlides.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlideIndex(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentSlideIndex
                          ? 'w-6 bg-white shadow'
                          : 'w-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>


        ) : (

          /* ══════════════════════════════════════════════════════
             DEFAULT MODE — "Quiet Power" + shoe card (no banner)
             ══════════════════════════════════════════════════════ */
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen bg-white pt-24 md:pt-28 pb-16 md:pb-24"
          >
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,#ffffff_0%,#FCFCFC_58%,#ffffff_100%)]" />

            <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10">
              <motion.div
                initial={false}
                animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.55 }}
                className="text-center"
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#D7DCE2] bg-white mb-10">
                  <span className="text-[10px] md:text-[11px] font-bold tracking-[0.22em] text-[#111827] uppercase">
                    B&amp;B Signature Footwear
                  </span>
                </div>

                <h1 className="text-[2.35rem] sm:text-[2.8rem] md:text-[5.8rem] lg:text-[8rem] leading-[0.9] tracking-[-0.045em] font-black text-[#06080F] max-w-[1100px] mx-auto">
                  Quiet Power.
                </h1>

                <p className="mt-8 text-sm md:text-base text-[#374151] max-w-[440px] mx-auto leading-relaxed tracking-[0.08em] uppercase">
                  Crafted for presence.
                </p>

                <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 w-full max-w-[520px] mx-auto">
                  <Link
                    href="/collections#all-products-grid"
                    className="group inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 md:px-7 py-3 rounded-full bg-[#06080F] !text-white text-xs md:text-sm font-bold tracking-[0.14em] uppercase hover:bg-[#161B26] transition-colors"
                  >
                    Explore Collection
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                  <Link
                    href="/new-arrivals"
                    className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 md:px-7 py-3 rounded-full border-2 border-[#06080F] bg-white text-[#06080F] text-xs md:text-sm font-bold tracking-[0.14em] uppercase hover:bg-[#06080F] hover:text-white transition-all"
                  >
                    New Arrivals
                  </Link>
                </div>
              </motion.div>

              {/* Shoe image card */}
              <motion.div
                initial={false}
                animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="relative mt-20 md:mt-24"
              >
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-[82%] h-24 bg-[#111827]/[0.06] blur-3xl rounded-full pointer-events-none" />

                <div className="relative rounded-[2rem] md:rounded-[2.5rem] border border-[#D8DEE6] bg-white p-3 md:p-4 shadow-[0_30px_80px_-30px_rgba(6,8,15,0.42)]">
                  <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] h-[280px] sm:h-[380px] md:h-[520px] lg:h-[600px]">
                    <motion.div
                      initial={false}
                      animate={
                        mounted && !shouldReduceMotion
                          ? { scale: [1.02, 1.04, 1.02], y: [0, -4, 0] }
                          : { scale: 1.02, y: 0 }
                      }
                      transition={{ duration: 24, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
                      className="w-full h-full"
                    >
                      <Image
                        src="https://res.cloudinary.com/dt2ikjlfc/image/upload/v1775127417/bb-shoes/hero/hero-purple-sandals.jpg"
                        alt="B&B Premium Stylish Sandals"
                        fill
                        priority
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 1320px"
                        className="object-cover object-center"
                      />
                    </motion.div>
                  </div>
                </div>

                <div className="mt-7 md:mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-10 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[#374151]">
                  <span>50K+ Clients</span>
                  <span className="w-1 h-1 rounded-full bg-[#9CA3AF]" />
                  <span>100% Authentic</span>
                  <span className="w-1 h-1 rounded-full bg-[#9CA3AF]" />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#A97A18] font-bold tracking-widest">
                    <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v0a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                    </svg>
                    Free Delivery Above PKR 3,500
                  </span>
                </div>

              </motion.div>
            </div>
          </motion.div>

        )}
      </AnimatePresence>
    </section>
  )
}