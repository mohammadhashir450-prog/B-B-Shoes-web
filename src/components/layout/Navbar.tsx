'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { useProducts } from '@/context/ProductContext'
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronRight,
  LogOut,
  Package,
  Settings
} from 'lucide-react'

// Condensed for the cinematic menu layout
const mainLinks = [
  { title: 'Home', href: '/' },
  { title: 'Collections', href: '/collections' },
  { title: 'Men', href: '/men' },
  { title: 'Women', href: '/women' },
  { title: 'Kids', href: '/kids' },
  { title: 'Accessories', href: '/accessories' }
]

const subLinks = [
  { title: 'New Arrivals', href: '/new-arrivals' },
  { title: 'Sales Event', href: '/sales', highlight: true },
  { title: 'Sneakers', href: '/sneakers' },
  { title: 'Slippers', href: '/slippers' },
  { title: 'Formal Shoes', href: '/formal' },
  { title: 'Running Shoes', href: '/running' }
]

const collectionFilterLinks = [
  { title: 'All Products', href: '/collections' },
  { title: 'New Arrivals', href: '/collections?category=new-arrivals' },
  { title: 'Sales & Discounts', href: '/collections?category=sales' },
  { title: 'Sneakers', href: '/collections?category=sneakers' },
  { title: 'Loafers', href: '/collections?category=loafers' },
  { title: 'Formal Shoes', href: '/collections?category=formal' },
  { title: 'Running Shoes', href: '/collections?category=running' },
  { title: 'Boots', href: '/collections?category=boots' },
  { title: 'Slippers', href: '/collections?category=slippers' },
  { title: 'Peshawari Chappal', href: '/collections?category=peshawari-chappal' },
  { title: 'Kids Collection', href: '/collections?category=kids' },
  { title: "Men's Collection", href: '/collections?category=men' },
  { title: "Women's Collection", href: '/collections?category=women' }
]

const sectionMenuGroups = [
  {
    title: 'Men',
    items: [
      { title: "Men's Collection", href: '/collections?category=men' },
      { title: 'Sneakers', href: '/collections?category=sneakers' },
      { title: 'Formal Shoes', href: '/collections?category=formal' },
      { title: 'Running Shoes', href: '/collections?category=running' },
      { title: 'Loafers', href: '/collections?category=loafers' },
      { title: 'Boots', href: '/collections?category=boots' },
      { title: 'Sandals', href: '/collections?category=sandals' },
    ],
  },
  {
    title: 'Women',
    items: [
      { title: "Women's Collection", href: '/collections?category=women' },
      { title: 'Ladies Sandals', href: '/collections?category=ladiessandals' },
      { title: 'Ladies Slippers', href: '/collections?category=ladiesslippers' },
      { title: 'Ladies Court Shoes', href: '/collections?category=ladiescourtshoes' },
      { title: 'Ladies Mucs', href: '/collections?category=ladiesmucs' },
      { title: 'Sneakers', href: '/collections?category=sneakers' },
      { title: 'Joggers', href: '/collections?category=joggers' },
    ],
  },
  {
    title: 'Kids',
    items: [
      { title: 'Kids Collection', href: '/collections?category=kids' },
      { title: 'Slippers', href: '/collections?category=slippers' },
      { title: 'Sandals', href: '/collections?category=sandals' },
      { title: 'Joggers', href: '/collections?category=joggers' },
      { title: 'Loafers', href: '/collections?category=loafers' },
      { title: 'Peshawari Chappal', href: '/collections?category=peshawari-chappal' },
    ],
  },
  {
    title: 'Accessories',
    items: [
      { title: 'Accessories Collection', href: '/accessories' },
      { title: 'Socks', href: '/collections?category=socks' },
      { title: 'Polish', href: '/collections?category=polish' },
      { title: 'Brushes', href: '/collections?category=brushes' },
    ],
  },
]

const accountLinks = [
  { title: 'My Orders', href: '/my-orders' },
  { title: 'My Addresses', href: '/my-addresses' },
  { title: 'Payment Methods', href: '/checkout' },
  { title: 'Contact Us', href: '/contact' },
  {
    title: 'For Transactions',
    href: '/contact#for-transactions',
    details: [
      'JazzCash: 03068846624',
      'Meezan Bank: 05100110600803',
    ],
  }
]

// --- Animation Variants for the New Profile Dropdown ---
const profileMenuVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 15, filter: 'blur(10px)' },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { 
      type: "spring", stiffness: 300, damping: 25,
      staggerChildren: 0.08, delayChildren: 0.1 
    }
  },
  exit: { 
    opacity: 0, scale: 0.95, y: 10, filter: 'blur(5px)',
    transition: { duration: 0.2 } 
  }
}

const profileItemVariants = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
}

const getRemainingParts = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const two = (value: number) => String(value).padStart(2, '0')

  return {
    days,
    label: `${days > 0 ? `${two(days)}d ` : ''}${two(hours)}h ${two(minutes)}m ${two(seconds)}s`,
  }
}

export default function Navbar() {
  const router = useRouter()
  const { totalItems } = useCart()
  const { allProducts } = useProducts()
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [salesEndsAt, setSalesEndsAt] = useState<string | null>(null)
  const [nowTick, setNowTick] = useState<number>(Date.now())
  
  // UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCollectionMenuOpen, setIsCollectionMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)
  const [openSectionGroup, setOpenSectionGroup] = useState<string | null>('Men')
  const [hoveredMenuLink, setHoveredMenuLink] = useState<string | null>(null)
  
  // Smart Scroll States
  const [isVisible, setIsVisible] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const lastScrollY = useRef(0)
  
  const profileRef = useRef<HTMLDivElement>(null)
  const collectionMenuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsCollectionMenuOpen(false)
    setIsProfileOpen(false) 
    if (isMenuOpen) setIsTransactionsOpen(false)
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto'
  }

  const toggleCollectionMenu = () => {
    setIsCollectionMenuOpen((prev) => !prev)
    setIsProfileOpen(false)
  }

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)

  // Smart Navigation Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsAtTop(currentScrollY < 50)

      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsVisible(false)
        setIsProfileOpen(false) 
      } else {
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const fetchSalesTimer = async () => {
      try {
        const response = await fetch('/api/settings/sales-timer', { cache: 'no-store' })
        if (!response.ok) return
        const result = await response.json()
        setSalesEndsAt(result?.data?.salesEndsAt || null)
      } catch {
        setSalesEndsAt(null)
      }
    }

    fetchSalesTimer()
    const timerPoll = setInterval(fetchSalesTimer, 60000)

    return () => clearInterval(timerPoll)
  }, [])

  useEffect(() => {
    const ticker = setInterval(() => {
      setNowTick(Date.now())
    }, 1000)

    return () => clearInterval(ticker)
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (collectionMenuRef.current && !collectionMenuRef.current.contains(event.target as Node)) {
        setIsCollectionMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  const handleSearchClick = () => {
    setIsMenuOpen(false)
    setIsCollectionMenuOpen(false)
    setIsProfileOpen(false)
    document.body.style.overflow = 'auto'
    router.push('/search')
  }

  const effectiveStatus = mounted ? status : 'loading'
  const effectiveSession = mounted ? session : null
  const effectiveTotalItems = mounted ? totalItems : 0

  const maxDiscount = allProducts.reduce((max, product) => {
    const discount = Number(product.discount || 0)
    if (discount > max) return discount

    if ((product.originalPrice || 0) > product.price && product.originalPrice) {
      const computed = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      return Math.max(max, computed)
    }

    return max
  }, 0)

  const salesEndMs = salesEndsAt ? new Date(salesEndsAt).getTime() : NaN
  const hasValidSalesTimer = Number.isFinite(salesEndMs) && salesEndMs > nowTick
  const isSalesBannerVisible = hasValidSalesTimer && maxDiscount > 0
  const remaining = isSalesBannerVisible ? getRemainingParts(salesEndMs - nowTick) : null
  const salesEndLabel = isSalesBannerVisible
    ? new Intl.DateTimeFormat('en-PK', {
        timeZone: 'Asia/Karachi',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(salesEndMs))
    : ''

  const navTopClass = isAtTop
    ? isSalesBannerVisible
      ? 'top-10 px-6 py-4 md:px-10'
      : 'top-0 px-6 py-6 md:px-10'
    : isSalesBannerVisible
      ? 'top-14 px-4'
      : 'top-4 px-4'

  return (
    <>
      <AnimatePresence>
        {isSalesBannerVisible && remaining && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-0 left-0 right-0 z-[130] bg-gradient-to-r from-[#A97A18] via-[#C59634] to-[#A97A18] text-white border-b border-[#8C6314]/30"
          >
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-2 flex items-center justify-center text-center">
              <Link href="/sales" className="block text-[11px] md:text-xs uppercase font-bold hover:opacity-90 transition-opacity leading-tight">
                <span className="block tracking-[0.08em] md:tracking-[0.15em]">Flash Sale Live: Up to {maxDiscount}% OFF | Ends in {remaining.label}</span>
                <span className="block mt-0.5 tracking-[0.06em] md:tracking-[0.12em]">Ends: {salesEndLabel} (PKT)</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 z-[100] flex justify-center transition-all duration-500 ease-out !bg-[#06080F] ${
          navTopClass
        }`}
      >
        <div 
          // REMOVED `overflow-hidden` here so the profile dropdown isn't clipped
          className={`flex items-center justify-between transition-all duration-500 relative !bg-[#06080F] ${
            isAtTop 
              ? 'w-full max-w-[1400px] border-transparent' 
              : 'w-full max-w-5xl backdrop-blur-xl border border-[#1a1a1a] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] rounded-full px-6 md:px-8 py-3'
          }`}
        >
          {/* Left: Hamburger */}
          <div className="flex items-center">
            <button 
              onClick={toggleMenu}
              className="group flex items-center gap-3 text-white hover:text-[#D4AF37] transition-colors" 
              aria-label="Menu"
            >
              <div className="relative flex flex-col items-center justify-center w-6 h-6">
                <span className={`absolute h-[1.5px] w-5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                <span className={`absolute h-[1.5px] bg-current transform transition-all duration-300 ${isMenuOpen ? 'w-0 opacity-0' : 'w-5'}`} />
                <span className={`absolute h-[1.5px] w-5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
              </div>
              <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-bold mt-0.5 group-hover:tracking-[0.25em] transition-all">
                {isMenuOpen ? 'Close' : 'Menu'}
              </span>
            </button>
          </div>

          {/* Center: Logo */}
          <div className="absolute inset-x-0 flex justify-center pointer-events-none z-10">
            <Link href="/" className="pointer-events-auto flex items-center justify-center group">
              <Image src="/logo.png" alt="Logo" width={100} height={40} priority className="w-[82px] sm:w-[94px] md:w-[100px] h-auto" />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-5 md:gap-6">
            <div className="relative order-last md:order-none ml-1 md:ml-0" ref={collectionMenuRef}>
              <button
                type="button"
                onClick={toggleCollectionMenu}
                className={`group flex items-center gap-2 transition-colors hover:scale-110 transform duration-300 ${isCollectionMenuOpen ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`}
                aria-label="Collections"
              >
                <div className="relative flex flex-col items-center justify-center w-5 h-5">
                  <span className={`absolute h-[1.5px] w-4 bg-current transform transition-all duration-300 ${isCollectionMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                  <span className={`absolute h-[1.5px] bg-current transform transition-all duration-300 ${isCollectionMenuOpen ? 'w-0 opacity-0' : 'w-4'}`} />
                  <span className={`absolute h-[1.5px] w-4 bg-current transform transition-all duration-300 ${isCollectionMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
                </div>
                <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-bold">Sections</span>
              </button>

              <AnimatePresence>
                {isCollectionMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-[calc(100%+14px)] w-[260px] max-h-[65vh] overflow-y-auto bg-white/95 backdrop-blur-2xl border border-[#E3D8C4] rounded-2xl shadow-[0_25px_60px_-20px_rgba(24,32,43,0.25)] p-2 z-[120]"
                  >
                    <div className="mb-1 px-1">
                      {collectionFilterLinks.slice(0, 3).map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => setIsCollectionMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#18202B] hover:text-[#0B101E] hover:bg-[#F6F1E7] transition-colors"
                        >
                          <span>{item.title}</span>
                          <ChevronRight size={14} className="text-[#8C97A8]" />
                        </Link>
                      ))}
                    </div>

                    <div className="my-2 border-t border-[#E7E0CF]" />

                    <div className="space-y-1">
                      {sectionMenuGroups.map((group) => {
                        const isOpen = openSectionGroup === group.title

                        return (
                          <div key={group.title} className="rounded-xl border border-[#E7E0CF] bg-[#FCFAF6] overflow-hidden">
                            <button
                              type="button"
                              onClick={() => setOpenSectionGroup((prev) => (prev === group.title ? null : group.title))}
                              className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                              aria-expanded={isOpen}
                            >
                              <span className="text-xs uppercase tracking-[0.18em] text-[#D4AF37] font-bold">{group.title}</span>
                              <ChevronRight
                                size={14}
                                className={`text-[#8C97A8] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                              />
                            </button>

                            <div className={`grid transition-all duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                              <div className="overflow-hidden">
                                <div className="pb-2 px-1 space-y-0.5">
                                  {group.items.map((item) => (
                                    <Link
                                      key={item.title}
                                      href={item.href}
                                      onClick={() => setIsCollectionMenuOpen(false)}
                                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#3A4556] hover:text-[#0B101E] hover:bg-[#F6F1E7] transition-colors"
                                    >
                                      <span>{item.title}</span>
                                      <ChevronRight size={13} className="text-[#8C97A8]" />
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={handleSearchClick}
              className="text-white hover:text-[#D4AF37] transition-colors hover:scale-110 transform duration-300"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            
            <Link href="/bag" className="text-white hover:text-[#D4AF37] transition-colors hover:scale-110 transform duration-300 relative group" aria-label="Shopping Bag">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <AnimatePresence>
                {effectiveTotalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1.5 -right-2 w-[18px] h-[18px] bg-[#D4AF37] text-[#0B101E] rounded-full flex items-center justify-center text-[9px] font-black shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                  >
                    {effectiveTotalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {/* NEW AND FIXED Profile Section */}
            <div className="relative flex items-center" ref={profileRef}>
              <button 
                type="button"
                onClick={toggleProfile}
                className={`transition-all duration-300 hover:scale-110 transform ${isProfileOpen ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'}`} 
                aria-label="User Account"
              >
                <User size={18} strokeWidth={1.5} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    variants={profileMenuVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    // Changed positioning to be absolutely pinned to the button rather than the container
                    className="absolute right-0 top-[calc(100%+24px)] w-[320px] bg-[#0B101E]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] z-[9999] origin-top-right overflow-hidden"
                  >
                    {effectiveStatus === 'loading' ? (
                      <div className="py-16 flex justify-center">
                        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : effectiveSession?.user ? (
                      <div>
                        {/* Header */}
                        <motion.div variants={profileItemVariants} className="px-6 py-6 bg-gradient-to-br from-white/5 to-transparent border-b border-white/5">
                          <p className="text-[#D4AF37] text-[9px] tracking-[0.2em] uppercase font-bold mb-3">Premium Member</p>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F4CE5C] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] text-black font-black text-xl">
                              {effectiveSession.user.name?.charAt(0) || effectiveSession.user.email?.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-white font-serif text-xl truncate">{effectiveSession.user.name || 'Member'}</p>
                              <p className="text-white/40 text-xs truncate mt-0.5">{effectiveSession.user.email}</p>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Links */}
                        <div className="p-3 space-y-1">
                          <motion.div variants={profileItemVariants}>
                            <Link href="/my-orders" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-colors group">
                              <div className="flex items-center gap-4 text-white/70 group-hover:text-white transition-colors">
                                <Package size={18} strokeWidth={1.5} className="group-hover:text-[#D4AF37] transition-colors" />
                                <span className="text-sm font-medium">Orders & Returns</span>
                              </div>
                              <ChevronRight size={16} className="text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                            </Link>
                          </motion.div>

                          <motion.div variants={profileItemVariants}>
                            <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-colors group">
                              <div className="flex items-center gap-4 text-white/70 group-hover:text-white transition-colors">
                                <Settings size={18} strokeWidth={1.5} className="group-hover:text-[#D4AF37] transition-colors" />
                                <span className="text-sm font-medium">Account Settings</span>
                              </div>
                              <ChevronRight size={16} className="text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                            </Link>
                          </motion.div>
                        </div>

                        {/* Footer */}
                        <motion.div variants={profileItemVariants} className="p-3 border-t border-white/5">
                          <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-colors text-xs font-bold tracking-[0.15em] uppercase">
                            <LogOut size={16} strokeWidth={2} />
                            Sign Out
                          </button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="p-8 text-center relative overflow-hidden">
                        {/* Decorative glow inside dropdown */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-[50px] rounded-full pointer-events-none" />
                        
                        <motion.div variants={profileItemVariants} className="w-16 h-16 mx-auto bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-5 relative z-10">
                          <User size={24} strokeWidth={1.5} className="text-[#D4AF37]" />
                        </motion.div>
                        <motion.h4 variants={profileItemVariants} className="text-white font-serif text-2xl mb-2 relative z-10">B&B Exclusive</motion.h4>
                        <motion.p variants={profileItemVariants} className="text-white/50 text-xs mb-8 relative z-10 leading-relaxed">Sign in to track orders, save items, and access exclusive drops.</motion.p>
                        
                        <div className="space-y-3 relative z-10">
                          <motion.div variants={profileItemVariants}>
                            <Link href="/login" onClick={() => setIsProfileOpen(false)} className="block w-full bg-[#D4AF37] hover:bg-white text-[#0B101E] font-bold tracking-[0.2em] uppercase py-4 px-4 rounded-full text-[10px] transition-colors">
                              Sign In
                            </Link>
                          </motion.div>
                          <motion.div variants={profileItemVariants}>
                            <Link href="/register" onClick={() => setIsProfileOpen(false)} className="block w-full border border-white/20 text-white hover:border-white hover:bg-white/5 font-bold tracking-[0.2em] uppercase py-4 px-4 rounded-full text-[10px] transition-all">
                              Create Account
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 2. THE CINEMATIC FULLSCREEN TAKEOVER MENU (UNCHANGED) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.3 } }}
            className="fixed inset-0 z-[90] bg-[#0B101E]/95 backdrop-blur-2xl flex flex-col justify-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-[#121A2F]/80 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative z-10 pt-20 h-full overflow-y-auto pb-20">
              
              <div className="flex flex-col justify-center space-y-2 md:space-y-4">
                <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-4 md:mb-8 ml-2">Navigation</p>
                {mainLinks.map((link, i) => (
                  <div key={link.title} className="overflow-hidden" onMouseEnter={() => setHoveredMenuLink(link.title)} onMouseLeave={() => setHoveredMenuLink(null)}>
                    <motion.div
                      initial={{ y: "100%", rotate: 5 }}
                      animate={{ y: 0, rotate: 0 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link 
                        href={link.href}
                        onClick={toggleMenu}
                        className={`block text-[12vw] md:text-[6vw] font-serif font-black leading-none tracking-tighter transition-all duration-500 ${
                          hoveredMenuLink === link.title 
                            ? 'text-white translate-x-4' 
                            : hoveredMenuLink 
                              ? 'text-white/20' 
                              : 'text-white/80'
                        }`}
                      >
                        {link.title}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-center">
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-2 gap-12"
                >
                  <div>
                    <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-6">Explore</p>
                    <ul className="space-y-4">
                      {subLinks.map((link) => (
                        <li key={link.title}>
                          <Link 
                            href={link.href} 
                            onClick={toggleMenu}
                            className={`text-sm md:text-base transition-colors hover:text-[#D4AF37] ${link.highlight ? 'text-[#D4AF37] font-medium' : 'text-white/60'}`}
                          >
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-6">Assistance</p>
                    <ul className="space-y-4">
                      {accountLinks.map((link) => (
                        <li key={link.title}>
                          {link.title === 'For Transactions' ? (
                            <button
                              type="button"
                              onClick={() => setIsTransactionsOpen((prev) => !prev)}
                              className="text-sm md:text-base text-white/60 hover:text-white transition-colors text-left"
                            >
                              {link.title}
                            </button>
                          ) : (
                            <Link 
                              href={link.href} 
                              onClick={toggleMenu}
                              className="text-sm md:text-base text-white/60 hover:text-white transition-colors"
                            >
                              {link.title}
                            </Link>
                          )}
                          {link.title === 'For Transactions' && link.details && isTransactionsOpen ? (
                            <div className="mt-2 space-y-1">
                              {link.details?.map((detail) => (
                                <p key={detail} className="text-[11px] md:text-xs text-white/40 tracking-wide">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-16 pt-8 border-t border-white/10"
                >
                   <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex gap-4">
                        {['Instagram', 'Twitter', 'Facebook'].map(social => (
                           <a key={social} href="#" className="text-white/40 hover:text-[#D4AF37] text-xs font-medium tracking-widest uppercase transition-colors">
                              {social}
                           </a>
                        ))}
                      </div>
                      <p className="text-white/20 text-[10px] uppercase tracking-widest">© 2024 B&B Shoes</p>
                   </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}