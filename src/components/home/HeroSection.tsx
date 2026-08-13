'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

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

  // Tick every second for timer-based banner filtering
  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  // Fetch banners with smart refresh scheduling
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
          item.endDate ? new Date(item.endDate).getTime() : NaN,
        ])
        .filter(time => Number.isFinite(time) && time > now)
      const nextRefreshAt = transitionTimes.length > 0 ? Math.min(...transitionTimes) + 1000 : now + 30000
      const delay = Math.max(5000, nextRefreshAt - now)
      refreshTimer = window.setTimeout(() => fetchFeaturedBanner(), delay)
    }

    const fetchFeaturedBanner = async () => {
      try {
        const response = await fetch('/api/settings/seasonal-banners', { cache: 'no-store' })
        const result = await response.json()
        const banners = response.ok && Array.isArray(result?.data) ? result.data : []
        if (!isMounted) return
        setFeaturedBanners(banners)
        scheduleRefresh(banners)
      } catch {
        if (isMounted) { setFeaturedBanners([]); scheduleRefresh([]) }
      }
    }

    fetchFeaturedBanner()
    syncInterval = window.setInterval(() => fetchFeaturedBanner(), 20000)

    return () => {
      isMounted = false
      clearRefreshTimer()
      if (syncInterval !== null) window.clearInterval(syncInterval)
    }
  }, [])

  // Filter banners by time window
  const activeBanners = featuredBanners.filter(banner => {
    if (banner.isActive === false) return false
    const startTime = banner.startDate ? new Date(banner.startDate).getTime() : Number.NEGATIVE_INFINITY
    const endTime = banner.endDate ? new Date(banner.endDate).getTime() : Number.POSITIVE_INFINITY
    return Number.isFinite(startTime) && Number.isFinite(endTime)
      ? startTime <= nowTick && endTime >= nowTick
      : endTime >= nowTick
  })

  // Build flat slide list from all active banners and their gallery images
  const heroSlides = activeBanners.flatMap(banner => {
    const images = [banner.bannerImage, ...(banner.galleryImages || [])].filter(img => Boolean(img?.trim()))
    return images.map((image, index) => ({ id: `${banner._id}-${index}`, image, banner }))
  })

  // Reset slide index when slide count changes
  useEffect(() => {
    if (!heroSlides.length) { setCurrentSlideIndex(0); return }
    setCurrentSlideIndex(prev => (prev >= heroSlides.length ? 0 : prev))
  }, [heroSlides.length])

  // Auto-advance slides
  useEffect(() => {
    if (heroSlides.length <= 1 || shouldReduceMotion) return
    const timer = window.setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [heroSlides.length, shouldReduceMotion])

  const currentSlide = heroSlides[currentSlideIndex] || null
  const hasBanner = Boolean(currentSlide)

  return (
    <section
      className="relative overflow-hidden"
      suppressHydrationWarning
    >
      <AnimatePresence mode="wait" initial={false}>
        {hasBanner ? (
          /* ─── BANNER MODE ─── */
          <motion.div
            key="banner-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full"
          >
            {/* Full-width banner image */}
            <div className="relative w-full h-[55vw] max-h-[680px] min-h-[320px] overflow-hidden bg-black">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide!.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentSlide!.image}
                    alt={currentSlide!.banner.title}
                    fill
                    priority
                    quality={90}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Dark gradient overlays for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

              {/* Navbar spacer — pushes content below nav */}
              <div className="absolute inset-0 flex flex-col justify-end">
                <div className="max-w-[1320px] mx-auto w-full px-6 md:px-10 pb-10 md:pb-16 pt-24 md:pt-28">
                  <motion.div
                    key={currentSlide!.banner._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.15 }}
                    className="max-w-[600px]"
                  >
                    {/* Season tag */}
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#D4AF37] mb-4 md:mb-6">
                      <span className="text-[10px] font-black tracking-[0.2em] text-[#0B101E] uppercase">
                        {currentSlide!.banner.season} Collection
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-[2rem] sm:text-[2.6rem] md:text-[3.8rem] lg:text-[4.8rem] leading-[0.95] tracking-[-0.03em] font-black text-white mb-4 md:mb-5">
                      {currentSlide!.banner.title}
                    </h1>

                    {/* Description */}
                    {currentSlide!.banner.description && (
                      <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-[480px]">
                        {currentSlide!.banner.description}
                      </p>
                    )}

                    {/* Discount badge */}
                    {currentSlide!.banner.discountPercent ? (
                      <div className="inline-flex items-center bg-rose-500/90 text-white text-sm font-black px-4 py-1.5 rounded-full mb-6 shadow-lg">
                        {currentSlide!.banner.discountPercent}% OFF — Limited Time
                      </div>
                    ) : null}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Link
                        href={currentSlide!.banner.linkUrl || '/collections'}
                        className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#06080F] text-sm font-bold tracking-[0.1em] uppercase hover:bg-[#D4AF37] transition-colors shadow-xl"
                      >
                        Shop Now
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/new-arrivals"
                        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/60 text-white text-sm font-bold tracking-[0.1em] uppercase hover:border-white hover:bg-white/10 transition-all backdrop-blur-sm"
                      >
                        New Arrivals
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Slide navigation dots */}
              {heroSlides.length > 1 && (
                <div className="absolute bottom-5 right-6 md:right-10 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIndex(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setCurrentSlideIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentSlideIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Trust strip below banner */}
            <div className="bg-white border-b border-[#E5E7EB] py-3">
              <div className="max-w-[1320px] mx-auto px-6 md:px-10 flex flex-wrap items-center justify-center gap-3 md:gap-10 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[#374151]">
                <span>50K+ Clients</span>
                <span className="w-1 h-1 rounded-full bg-[#9CA3AF]" />
                <span>100% Authentic</span>
                <span className="w-1 h-1 rounded-full bg-[#9CA3AF] hidden md:block" />
                <span className="hidden md:block">Premium Quality</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ─── DEFAULT HERO MODE (no active banner) ─── */
          <motion.div
            key="default-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
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
                    B&B Signature Footwear
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
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/new-arrivals"
                    className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 md:px-7 py-3 rounded-full border-2 border-[#06080F] bg-white text-[#06080F] text-xs md:text-sm font-bold tracking-[0.14em] uppercase hover:bg-[#06080F] hover:text-white transition-all"
                  >
                    New Arrivals
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="relative mt-20 md:mt-24"
              >
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-[82%] h-24 bg-[#111827]/8 blur-3xl rounded-full" />

                <div className="relative rounded-[2rem] md:rounded-[2.5rem] border border-[#D8DEE6] bg-white p-3 md:p-4 shadow-[0_30px_80px_-30px_rgba(6,8,15,0.42)]">
                  <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] h-[380px] md:h-[560px] lg:h-[640px]">
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
                        sizes="100vw"
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}