'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Grid, 
  Sparkles, 
  Tag, 
  UserCircle, 
  Info, 
  Mail, 
  Settings,
  Home,
  ChevronDown,
  Package,
  MapPin,
  CreditCard,
  LogOut
} from 'lucide-react'

// Menu data structure
const menuData = [
  { 
    title: 'Home', 
    icon: Home, 
    href: '/' 
  },
  { 
    title: 'New Arrivals', 
    icon: Sparkles, 
    href: '/new-arrivals'
  },
  { 
    title: 'Sales Event', 
    icon: Tag, 
    href: '/sales',
    highlighted: true 
  },
  { 
    title: 'Collections', 
    icon: Grid,
    submenu: [
      { title: 'All Categories', href: '/collections' },
      { title: "Men's Collection", href: '/men' },
      { title: "Women's Collection", href: '/women' },
      { title: 'Sneakers', href: '/sneakers' },
      { title: 'Basketball', href: '/basketball' },
      { title: 'Formal Shoes', href: '/formal' },
      { title: 'Running Shoes', href: '/running' },
      { title: 'Heritage Series', href: '/heritage' }
    ]
  },
  { 
    title: 'Sales & Discount', 
    icon: Tag,
    href: '/sales'
  },
  {
    title: 'My Orders',
    icon: Package,
    href: '/my-orders'
  },
  {
    title: 'My Addresses',
    icon: MapPin,
    href: '/my-addresses'
  },
  {
    title: 'Payment Methods',
    icon: CreditCard,
    href: '/checkout'
  },
  { 
    title: 'Account', 
    icon: UserCircle,
    submenu: [
      { title: 'Login', href: '/login' },
      { title: 'Register', href: '/register' },
      { title: 'Profile', href: '/profile' },
      { title: 'Settings', href: '/settings' }
    ]
  },
  { 
    title: 'Company', 
    icon: Info,
    submenu: [
      { title: 'About Us', href: '/about' },
      { title: 'Contact Us', href: '/contact' }
    ]
  }
]

export default function Navbar() {
  const { totalItems } = useCart()
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const profileRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleProfile = () => {
    console.log('🔘 Profile button clicked, current state:', isProfileOpen)
    console.log('Session status:', status, 'User:', session?.user?.email)
    setIsProfileOpen(!isProfileOpen)
  }
  
  const toggleSubmenu = (title: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0B101E] py-5 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <svg width="34" height="22" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 28 Q4 32 8 32 L44 32 Q48 32 48 28 L48 26 L4 26 Z" fill="#D4AF37"/>
            <path d="M4 26 L4 16 Q4 10 10 8 L24 7 Q30 7 34 10 L48 26 Z" fill="#D4AF37"/>
            <path d="M12 18 C16 15 22 15 26 17" stroke="#0B101E" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div>
            <span className="text-[#D4AF37] text-xl font-bold tracking-widest block leading-tight">B&B Shoes</span>
            <span className="text-[#D4AF37]/55 text-[8px] tracking-[0.28em] uppercase">Brand You Like</span>
          </div>
        </Link>

        {/* Navigation Links (Centered) */}
        <div className="hidden md:flex items-center gap-12">
          <Link href="/collections" className="text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors">
            COLLECTIONS
          </Link>
          <Link href="/men" className="text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors">
            MEN
          </Link>
          <Link href="/women" className="text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors">
            WOMEN
          </Link>
          <Link href="/heritage" className="text-white text-[10px] font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors">
            HERITAGE
          </Link>
        </div>

        {/* Icons Section (Right) */}
        <div className="flex items-center gap-7">
          {/* Hamburger Menu Button */}
          <button 
            onClick={toggleMenu}
            className="text-[#D4AF37] hover:text-white transition-colors" 
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>

          <button className="text-[#D4AF37] hover:text-white transition-colors" aria-label="Search">
            <Search size={18} strokeWidth={2} />
          </button>
          
          <Link href="/bag" className="text-[#D4AF37] hover:text-white transition-colors relative" aria-label="Shopping Bag">
            <ShoppingBag size={18} strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#D4AF37] text-[#0B101E] rounded-full flex items-center justify-center text-[9px] font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={toggleProfile}
              className="text-[#D4AF37] hover:text-white transition-colors" 
              aria-label="User Account"
            >
              <User size={18} strokeWidth={2} />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-3 w-72 bg-[#0B1829]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[9999]"
                >
                  {status === 'loading' ? (
                    <div className="p-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
                      <p className="text-white/60 text-sm mt-3">Loading...</p>
                    </div>
                  ) : session?.user ? (
                    <>
                      {/* User Info Section */}
                      <div className="p-6 border-b border-white/10 bg-gradient-to-br from-[#D4AF37]/10 to-transparent">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center">
                            <span className="text-black font-bold text-lg">
                              {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">
                              {session.user.name || 'User'}
                            </p>
                            <p className="text-white/60 text-xs truncate">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <UserCircle size={18} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                          <span className="text-white/90 text-sm group-hover:text-white">My Profile</span>
                        </Link>
                        
                        <Link
                          href="/my-orders"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <Package size={18} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                          <span className="text-white/90 text-sm group-hover:text-white">My Orders</span>
                        </Link>
                        
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <Settings size={18} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                          <span className="text-white/90 text-sm group-hover:text-white">Settings</span>
                        </Link>
                      </div>

                      {/* Sign Out Button */}
                      <div className="p-2 border-t border-white/10">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors group"
                        >
                          <LogOut size={18} className="text-red-400 group-hover:scale-110 transition-transform" />
                          <span className="text-red-400 text-sm font-medium group-hover:text-red-300">Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Not Logged In */}
                      <div className="p-6">
                        <p className="text-white/60 text-sm mb-4 text-center">
                          Sign in to access your account
                        </p>
                        <div className="space-y-2">
                          <Link
                            href="/login"
                            onClick={() => setIsProfileOpen(false)}
                            className="block w-full bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-semibold py-3 px-4 rounded-lg text-center text-sm transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setIsProfileOpen(false)}
                            className="block w-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold py-3 px-4 rounded-lg text-center text-sm transition-colors"
                          >
                            Create Account
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
      </div>

      {/* Premium Glassmorphism Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-black/60 backdrop-blur-sm z-40"
              onClick={toggleMenu}
            />
            
            {/* Menu Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-[72px] left-0 w-[320px] h-[calc(100vh-72px)] bg-black/90 backdrop-blur-2xl border-r border-white/10 z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                {/* Brand Section */}
                <div className="flex items-center gap-3 px-4 py-6 mb-6 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4CE5C] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                    <svg width="22" height="15" viewBox="0 0 52 36" fill="none">
                      <path d="M4 28 Q4 32 8 32 L44 32 Q48 32 48 28 L48 26 L4 26 Z" fill="#0B101E"/>
                      <path d="M4 26 L4 16 Q4 10 10 8 L24 7 Q30 7 34 10 L48 26 Z" fill="#0B101E"/>
                      <path d="M12 18 C16 15 22 15 26 17" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xl font-bold tracking-wider text-white">B&B Shoes</span>
                    <p className="text-[10px] text-gray-400 tracking-wider">EST. 2023 • Brand You Like</p>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  {menuData.map((item) => {
                    const isOpen = openMenus[item.title]
                    const hasSubmenu = item.submenu && item.submenu.length > 0

                    return (
                      <div key={item.title}>
                        {/* Main Menu Item */}
                        {hasSubmenu ? (
                          <button
                            onClick={() => toggleSubmenu(item.title)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                              isOpen ? 'bg-white/10' : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <item.icon 
                                size={20} 
                                className="text-white/70 group-hover:text-[#D4AF37] transition-colors" 
                              />
                              <span className="text-[15px] font-medium text-white/90 group-hover:text-white">
                                {item.title}
                              </span>
                            </div>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown size={16} className="text-white/50 group-hover:text-[#D4AF37]" />
                            </motion.div>
                          </button>
                        ) : (
                          <Link
                            href={item.href || '#'}
                            onClick={toggleMenu}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                              item.highlighted 
                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] hover:from-[#F4CE5C] hover:to-[#D4AF37] shadow-lg shadow-[#D4AF37]/30' 
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <item.icon 
                                size={20} 
                                className={item.highlighted ? 'text-black' : 'text-white/70 group-hover:text-[#D4AF37]'}
                              />
                              <span className={`text-[15px] font-medium ${
                                item.highlighted 
                                  ? 'text-black font-bold' 
                                  : 'text-white/90 group-hover:text-white'
                              }`}>
                                {item.title}
                              </span>
                            </div>
                          </Link>
                        )}

                        {/* Submenu Items */}
                        <AnimatePresence>
                          {hasSubmenu && isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="py-2 space-y-1 ml-2 border-l-2 border-white/5">
                                {item.submenu?.map((subItem) => (
                                  <Link
                                    key={subItem.title}
                                    href={subItem.href}
                                    onClick={toggleMenu}
                                    className="block w-full pl-10 pr-4 py-2.5 text-[14px] text-white/60 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-all"
                                  >
                                    {subItem.title}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </nav>

                {/* Bottom Section */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-gray-500 text-center mb-4">
                    Milano • London • New York • Tokyo
                  </p>
                  <div className="flex justify-center gap-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#D4AF37] flex items-center justify-center transition-all group">
                      <span className="text-white group-hover:text-black text-xs">FB</span>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#D4AF37] flex items-center justify-center transition-all group">
                      <span className="text-white group-hover:text-black text-xs">IG</span>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#D4AF37] flex items-center justify-center transition-all group">
                      <span className="text-white group-hover:text-black text-xs">TW</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}