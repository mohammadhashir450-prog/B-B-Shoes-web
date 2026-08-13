'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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

  // Fetch banners + schedule next re-fetch exactly at banner start/end boundaries
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
      const delay  = Math.max(2000, nextAt - now)
      refreshTimer = window.setTimeout(() => fetchBanners(), delay)
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
    // Background sync every 15 s as safety net
    syncInterval = window.setInterval(() => fetchBanners(), 15_000)

    return () => {
      isMounted = false
      clearRefreshTimer()
      if (syncInterval !== null) window.clearInterval(syncInterval)
    }
  }, [])

  // ── 100% accurate time-based filter — re-evaluated every second via nowTick ──
  const activeBanners = featuredBanners.filter(banner => {
    if (banner.isActive === false) return false
    const start = banner.startDate ? new Date(banner.startDate).getTime() : Number.NEGATIVE_INFINITY
    const end   = banner.endDate   ? new Date(banner.endDate).getTime()   : Number.POSITIVE_INFINITY
    // Both dates present → strict window
    if (banner.startDate && banner.endDate) return start <= nowTick && nowTick < end
    // Only end date → active until expiry
    if (banner.endDate) return nowTick < end
    // Only start date → active from start onward
    if (banner.startDate) return nowTick >= start
    // No dates → always active
    return true
  })

  // Flatten banner + gallery images into slide list (bannerImage only — no gallery split)
  // Each banner contributes ONE slide (its bannerImage).
  // If admin added gallery images they appear as additional slides within the same banner.
  const heroSlides = activeBanners.flatMap(banner => {
    const imgs = [banner.bannerImage, ...(banner.galleryImages ?? [])]
      .filter(img => Boolean(img?.trim()))
    return imgs.map((image, i) => ({ id: `${banner._id}-${i}`, image, banner }))
  })

  // Guard slide index in range
  useEffect(() => {
    if (!heroSlides.length) { setCurrentSlideIndex(0); return }
    setCurrentSlideIndex(prev => (prev >= heroSlides.length ? 0 : prev))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSlides.length])

  // Auto-advance slides (only when multiple slides exist)
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

      {/* ══════════════════════════════════════════════════
          TOP AREA — Banner image OR "Quiet Power" heading
          ══════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait" initial={false}>
        {hasBanner ? (
          /* ── BANNER MODE: pure admin image, zero overlays ── */
          <motion.div
            key="banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full pt-16 md:pt-20"   /* offset for fixed navbar */
          >
            {/* Image wrapper — aspect-ratio based so it scales perfectly on all viewports */}
            <div className="relative w-full overflow-hidden"
              style={{ aspectRatio: '21/9', minHeight: '200px', maxHeight: '640px' }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide!.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentSlide!.image}
                    alt={currentSlide!.banner.title}
                    fill
                    priority
                    quality={92}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slide dots — only when multiple slides, minimal & unobtrusive */}
              {heroSlides.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                  {heroSlides.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlideIndex(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentSlideIndex
                          ? 'w-6 bg-white shadow-md'
                          : 'w-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ── DEFAULT MODE: "Quiet Power" heading when no banner is active ── */
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative pt-24 md:pt-28 pb-0"
          >
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,#ffffff_0%,#FCFCFC_58%,#ffffff_100%)]" />
            <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 text-center">
              <motion.div
                initial={false}
                animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.55 }}
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          BOTTOM AREA — Shoe image card (always visible)
          ══════════════════════════════════════════════════ */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 pb-16 md:pb-24">
        <motion.div
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="relative mt-10 md:mt-12"
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
                  priority={!hasBanner}
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
          </div>
        </motion.div>
      </div>

    </section>
  )
}