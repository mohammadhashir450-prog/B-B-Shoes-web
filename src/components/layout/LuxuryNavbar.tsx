'use client'

import Link from 'next/link'
import { Search, User } from 'lucide-react'

export default function LuxuryNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0e1724]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between py-5">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <span className="text-[#f4cf3e] text-3xl font-bold tracking-tighter">
                B<span className="text-white">&</span>B
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f4cf3e] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/collections" className="relative text-white text-[11px] font-bold tracking-[0.2em] hover:text-[#f4cf3e] transition-colors uppercase group">
              Collections
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#f4cf3e] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/men" className="relative text-white text-[11px] font-bold tracking-[0.2em] hover:text-[#f4cf3e] transition-colors uppercase group">
              Men
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#f4cf3e] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/women" className="relative text-white text-[11px] font-bold tracking-[0.2em] hover:text-[#f4cf3e] transition-colors uppercase group">
              Women
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#f4cf3e] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/kids" className="relative text-white text-[11px] font-bold tracking-[0.2em] hover:text-[#f4cf3e] transition-colors uppercase group">
              Kids
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#f4cf3e] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            <button className="text-[#f4cf3e] hover:text-[#ffd700] transition-all hover:scale-110">
              <Search size={18} strokeWidth={2.5} />
            </button>
            <button className="text-[#f4cf3e] hover:text-[#ffd700] transition-all hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className="text-[#f4cf3e] hover:text-[#ffd700] transition-all hover:scale-110">
              <User size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
