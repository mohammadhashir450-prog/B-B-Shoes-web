'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'

interface ISeasonalBanner {
  _id: string
  season: string
  title: string
  description?: string
  bannerImage: string
  galleryImages?: string[]
  linkUrl?: string
  discountPercent?: number
  startDate: string
  endDate: string
  isActive: boolean
}

export default function SeasonalBanners() {
  const [banners, setBanners] = useState<ISeasonalBanner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [nowTick, setNowTick] = useState<number>(() => Date.now())
  const [loading, setLoading] = useState(true)
  const refreshTimerRef = useRef<number | null>(null)
  const fetchBannersRef = useRef<() => void>(() => {})
  const scheduleRefreshRef = useRef<(items: ISeasonalBanner[]) => void>(() => {})

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    scheduleRefreshRef.current = (items: ISeasonalBanner[]) => {
      clearRefreshTimer()

      const now = Date.now()
      const transitionTimes = items
        .flatMap((item) => [new Date(item.startDate).getTime(), new Date(item.endDate).getTime()])
        .filter((time) => Number.isFinite(time) && time > now)

      const nextRefreshAt = transitionTimes.length > 0 ? Math.min(...transitionTimes) + 1000 : now + 30000
      const delay = Math.max(5000, nextRefreshAt - now)

      refreshTimerRef.current = window.setTimeout(() => {
        fetchBannersRef.current()
      }, delay)
    }
  }, [])

  const fetchBanners = useCallback(async () => {
    try {
      const response = await fetch('/api/settings/seasonal-banners', { cache: 'no-store' })
      const result = await response.json()
      const nextBanners = Array.isArray(result?.data) ? result.data : []
      setBanners(nextBanners)
      setCurrentIndex((prev) => (nextBanners.length ? Math.min(prev, nextBanners.length - 1) : 0))
      scheduleRefreshRef.current(nextBanners)
    } catch (error) {
      console.error('Failed to fetch seasonal banners:', error)
      setBanners([])
      scheduleRefreshRef.current([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBannersRef.current = fetchBanners
  }, [fetchBanners])

  useEffect(() => {
    fetchBanners()

    return () => {
      clearRefreshTimer()
    }
  }, [fetchBanners])

  const activeBanners = banners.filter((banner) => {
    const startTime = new Date(banner.startDate).getTime()
    const endTime = new Date(banner.endDate).getTime()

    if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
      return false
    }

    return startTime <= nowTick && endTime >= nowTick
  })

  useEffect(() => {
    if (currentIndex >= activeBanners.length) {
      setCurrentIndex(0)
    }
  }, [currentIndex, activeBanners.length])

  const currentBanner = activeBanners[currentIndex]
  const currentBannerImages = currentBanner
    ? [currentBanner.bannerImage, ...(currentBanner.galleryImages || [])].filter((image) => Boolean(image?.trim()))
    : []

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [currentIndex])

  useEffect(() => {
    if (activeBanners.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [activeBanners.length])

  useEffect(() => {
    if (currentBannerImages.length <= 1) {
      return
    }

    const imageTimer = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentBannerImages.length)
    }, 3000)

    return () => window.clearInterval(imageTimer)
  }, [currentBannerImages.length])

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
  }

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))
  }

  if (!activeBanners.length || loading || !currentBanner) {
    return null
  }

  return (
    <section className="relative bg-gradient-to-r from-[#06080F] via-[#0B101E] to-[#06080F] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="px-4 sm:px-6 md:px-10 py-6 md:py-8"
          >
            <Link href={currentBanner.linkUrl || '/collections'} className="group block">
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-r from-[#0B101E] to-[#121A2F] shadow-[0_20px_40px_-20px_rgba(212,175,55,0.3)]">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 p-4 md:p-8">
                  <div className="relative w-full md:w-[45%] h-[200px] md:h-[240px] rounded-xl overflow-hidden bg-[#1a2332] flex-shrink-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${currentBanner._id}-${currentImageIndex}`}
                        initial={{ opacity: 0.35, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.2, scale: 0.98 }}
                        transition={{ duration: 0.45 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={currentBannerImages[currentImageIndex] || currentBanner.bannerImage}
                          alt={`${currentBanner.title} slide ${currentImageIndex + 1}`}
                          fill
                          priority
                          quality={90}
                          sizes="(max-width: 768px) 100vw, 45vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B101E]/40 to-transparent" />
                    {currentBannerImages.length > 1 && (
                      <div className="absolute bottom-3 left-3 flex gap-1.5">
                        {currentBannerImages.map((_, idx) => (
                          <button
                            key={`${currentBanner._id}-img-dot-${idx}`}
                            type="button"
                            onClick={(event) => {
                              event.preventDefault()
                              setCurrentImageIndex(idx)
                            }}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === currentImageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/45'
                            }`}
                            aria-label={`Show image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                      <Zap className="w-5 h-5 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] text-[10px] tracking-[0.2em] uppercase font-bold">
                        {currentBanner.season} Collection
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-serif font-black text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {currentBanner.title}
                    </h2>

                    {currentBanner.description && (
                      <p className="text-[#B4BBCA] text-sm md:text-base mb-4 leading-relaxed">
                        {currentBanner.description}
                      </p>
                    )}

                    <div className="flex items-center justify-center md:justify-start gap-4">
                      {currentBanner.discountPercent ? (
                        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-4 py-2">
                          <p className="text-[#D4AF37] font-bold text-lg">{currentBanner.discountPercent}% OFF</p>
                        </div>
                      ) : null}

                      <button className="px-6 py-2 bg-[#D4AF37] text-[#0B101E] font-bold text-sm rounded-lg hover:bg-[#E5C158] transition-colors">
                        Explore Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {activeBanners.length > 1 && (
          <div className="flex items-center justify-center md:justify-end gap-3 px-4 sm:px-6 md:px-10 pb-6">
            <button
              onClick={prevBanner}
              className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B101E] transition-all"
              aria-label="Previous banner"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>

            <div className="flex gap-1.5">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-[#D4AF37]/25 hover:bg-[#D4AF37]/50'
                  }`}
                  aria-label={`Go to banner ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextBanner}
              className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B101E] transition-all"
              aria-label="Next banner"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
