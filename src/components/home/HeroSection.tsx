'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const Hero3DShowcase = dynamic(() => import('@/components/home/Hero3DShowcase'), { ssr: false })

interface SeasonalBannerSummary {
  _id: string
  season: 'Summer' | 'Winter' | 'Spring' | 'Fall'
  title: string
  description?: string
  bannerImage: string
  galleryImages?: string[]
  linkUrl?: string
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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    let refreshTimer: number | null = null
    let syncInterval: number | null = null

    const clearRefreshTimer = () => {
      if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer)
        refreshTimer = null
      }
    }

    const scheduleRefresh = (items: SeasonalBannerSummary[]) => {
      clearRefreshTimer()

      const now = Date.now()
      const transitionTimes = items
        .flatMap((item) => [
          item.startDate ? new Date(item.startDate).getTime() : NaN,
          item.endDate ? new Date(item.endDate).getTime() : NaN,
        ])
        .filter((time) => Number.isFinite(time) && time > now)

      const nextRefreshAt = transitionTimes.length > 0 ? Math.min(...transitionTimes) + 1000 : now + 30000
      const delay = Math.max(5000, nextRefreshAt - now)

      refreshTimer = window.setTimeout(() => {
        fetchFeaturedBanner()
      }, delay)
    }

    const fetchFeaturedBanner = async () => {
      try {
        const response = await fetch('/api/settings/seasonal-banners', { cache: 'no-store' })
        const result = await response.json()
        const banners = response.ok && Array.isArray(result?.data) ? result.data : []

        if (!isMounted) {
          return
        }

        setFeaturedBanners(banners)
        scheduleRefresh(banners)
      } catch {
        if (isMounted) {
          setFeaturedBanners([])
          scheduleRefresh([])
        }
      }
    }

    fetchFeaturedBanner()
    syncInterval = window.setInterval(() => {
      fetchFeaturedBanner()
    }, 20000)

    return () => {
      isMounted = false
      clearRefreshTimer()
      if (syncInterval !== null) {
        window.clearInterval(syncInterval)
      }
    }
  }, [])

  const activeFeaturedBanners = featuredBanners.filter((banner) => {
    if (banner.isActive === false) {
      return false
    }

    const startTime = banner.startDate ? new Date(banner.startDate).getTime() : Number.NEGATIVE_INFINITY
    const endTime = banner.endDate ? new Date(banner.endDate).getTime() : Number.POSITIVE_INFINITY

    return Number.isFinite(startTime) && Number.isFinite(endTime)
      ? startTime <= nowTick && endTime >= nowTick
      : endTime >= nowTick
  })

  const heroSlides = activeFeaturedBanners.flatMap((banner) => {
    const images = [banner.bannerImage, ...(banner.galleryImages || [])].filter((image) => Boolean(image?.trim()))

    return images.map((image, index) => ({
      id: `${banner._id}-${index}`,
      image,
      banner,
    }))
  })

  useEffect(() => {
    if (!heroSlides.length) {
      setCurrentSlideIndex(0)
      return
    }

    setCurrentSlideIndex((prev) => (prev >= heroSlides.length ? 0 : prev))
  }, [heroSlides.length])

  useEffect(() => {
    if (!heroSlides.length || shouldReduceMotion) {
      return
    }

    const timer = window.setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [heroSlides.length, shouldReduceMotion])

  const currentSlide = heroSlides[currentSlideIndex] || null
  const heroTitle = currentSlide ? `${currentSlide.banner.season} Collection.` : 'Quiet Power.'
  const heroSubtitle = currentSlide?.banner.title || 'Crafted for presence.'

  return (
    <section className="relative min-h-screen bg-white overflow-hidden pt-24 md:pt-28 pb-16 md:pb-24" suppressHydrationWarning>
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
              {currentSlide ? `${currentSlide.banner.season} Drop` : 'B&B Signature Footwear'}
            </span>
          </div>

          <h1 className="text-[2.35rem] sm:text-[2.8rem] md:text-[5.8rem] lg:text-[8rem] leading-[0.9] tracking-[-0.045em] font-black text-[#06080F] max-w-[1100px] mx-auto">
            {heroTitle}
          </h1>

          <p className="mt-8 text-sm md:text-base text-[#374151] max-w-[440px] mx-auto leading-relaxed tracking-[0.08em] uppercase">
            {heroSubtitle}
          </p>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 w-full max-w-[520px] mx-auto">
            <Link
              href={currentSlide?.banner.linkUrl || '/collections#all-products-grid'}
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
          className="relative mt-16 md:mt-20"
        >
          {/* 3D Shoe Showcase */}
          <Hero3DShowcase />
        </motion.div>
      </div>
    </section>
  )
}