'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

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
    const timer = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    scheduleRefreshRef.current = (items: ISeasonalBanner[]) => {
      clearRefreshTimer()
      const now = Date.now()
      const transitionTimes = items
        .flatMap(item => [new Date(item.startDate).getTime(), new Date(item.endDate).getTime()])
        .filter(time => Number.isFinite(time) && time > now)
      const nextRefreshAt = transitionTimes.length > 0 ? Math.min(...transitionTimes) + 1000 : now + 30000
      const delay = Math.max(5000, nextRefreshAt - now)
      refreshTimerRef.current = window.setTimeout(() => fetchBannersRef.current(), delay)
    }
  }, [])

  const fetchBanners = useCallback(async () => {
    try {
      const response = await fetch('/api/settings/seasonal-banners', { cache: 'no-store' })
      const result = await response.json()
      const nextBanners = Array.isArray(result?.data) ? result.data : []
      setBanners(nextBanners)
      setCurrentIndex(prev => (nextBanners.length ? Math.min(prev, nextBanners.length - 1) : 0))
      scheduleRefreshRef.current(nextBanners)
    } catch (error) {
      console.error('Failed to fetch seasonal banners:', error)
      setBanners([])
      scheduleRefreshRef.current([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBannersRef.current = fetchBanners }, [fetchBanners])

  useEffect(() => {
    fetchBanners()
    return () => clearRefreshTimer()
  }, [fetchBanners])

  // Timer-based filtering: only show banners within their active date window
  const activeBanners = banners.filter(banner => {
    if (!banner.isActive) return false
    const startTime = new Date(banner.startDate).getTime()
    const endTime = new Date(banner.endDate).getTime()
    if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return false
    return startTime <= nowTick && endTime >= nowTick
  })

  useEffect(() => {
    if (currentIndex >= activeBanners.length) setCurrentIndex(0)
  }, [currentIndex, activeBanners.length])

  // Auto-cycle through multiple banners
  useEffect(() => {
    if (activeBanners.length <= 1) return
    const timer = window.setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [activeBanners.length])

  const currentBanner = activeBanners[currentIndex]

  // If no active banners, render nothing — banner display is handled in HeroSection
  if (!activeBanners.length || loading || !currentBanner) return null

  return (
    <section className="relative w-full overflow-hidden bg-[#06080F]">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#D4AF37]/6 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-[#D4AF37]/4 rounded-full blur-[80px]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <Link href={currentBanner.linkUrl || '/collections'} className="group block relative">
            {/* Full-width banner image */}
            <div className="relative w-full overflow-hidden" style={{ paddingBottom: '22%', minHeight: '180px' }}>
              <Image
                src={currentBanner.bannerImage}
                alt={currentBanner.title}
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />

              {/* Gradient overlays for text */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-[1400px] mx-auto w-full px-6 md:px-10">
                  <div className="max-w-[520px]">
                    {/* Season + discount tag row */}
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                      <span className="text-[10px] font-black tracking-[0.2em] text-[#D4AF37] uppercase">
                        {currentBanner.season} Collection
                      </span>
                      {currentBanner.discountPercent ? (
                        <>
                          <span className="w-1 h-1 rounded-full bg-white/30" />
                          <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-[0.1em] uppercase">
                            {currentBanner.discountPercent}% OFF
                          </span>
                        </>
                      ) : null}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-[-0.02em] mb-2 md:mb-3 group-hover:text-[#F5E7B8] transition-colors">
                      {currentBanner.title}
                    </h2>

                    {/* Description */}
                    {currentBanner.description && (
                      <p className="text-white/65 text-xs md:text-sm leading-relaxed mb-4 md:mb-5 max-w-[380px] line-clamp-2">
                        {currentBanner.description}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-[#D4AF37] text-xs md:text-sm font-bold tracking-[0.1em] uppercase group-hover:gap-3 transition-all">
                      <span>Shop Collection</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation arrows (multiple banners only) */}
          {activeBanners.length > 1 && (
            <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
                aria-label="Previous banner"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => (prev + 1) % activeBanners.length)}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
                aria-label="Next banner"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Dot indicators */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to banner ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
