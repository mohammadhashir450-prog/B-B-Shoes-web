'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import HeroDefault from '@/components/home/HeroDefault'

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
    <section className="relative overflow-hidden" suppressHydrationWarning>

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
            className="relative"
          >
            <HeroDefault />
          </motion.div>

        )}
      </AnimatePresence>
    </section>
  )
}