'use client'

import Link from 'next/link'
import { Facebook, Instagram, Youtube } from 'lucide-react'

export default function LuxuryFooter() {
  return (
    <footer className="bg-[#0e1724] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand - Column 1 */}
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <svg width="34" height="22" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 28 Q4 32 8 32 L44 32 Q48 32 48 28 L48 26 L4 26 Z" fill="#f4cf3e"/>
                  <path d="M4 26 L4 16 Q4 10 10 8 L24 7 Q30 7 34 10 L48 26 Z" fill="#f4cf3e"/>
                  <path d="M12 18 C16 15 22 15 26 17" stroke="#0e1724" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <span className="text-[#f4cf3e] text-2xl font-bold tracking-tight">B&B Shoes</span>
              </div>
              <p className="text-[#f4cf3e]/50 text-[9px] tracking-[0.28em] uppercase">Brand You Like</p>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Luxury footwear for every occasion, since 2023.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/50 hover:text-[#f4cf3e] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white/50 hover:text-[#f4cf3e] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white/50 hover:text-[#f4cf3e] transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Collections - Column 2 */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Collections
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/kids" className="text-white/50 hover:text-white transition-colors text-sm">
                  The Kids Collection
                </Link>
              </li>
              <li>
                <Link href="/italian" className="text-white/50 hover:text-white transition-colors text-sm">
                  Italian Hand-made
                </Link>
              </li>
              <li>
                <Link href="/french" className="text-white/50 hover:text-white transition-colors text-sm">
                  Le French Edironde
                </Link>
              </li>
              <li>
                <Link href="/bespoke" className="text-white/50 hover:text-white transition-colors text-sm">
                  Bespoke Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Guest Care - Column 3 */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Guest Care
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/consultation" className="text-white/50 hover:text-white transition-colors text-sm">
                  Private Consultations
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white/50 hover:text-white transition-colors text-sm">
                  Shipping & Policies
                </Link>
              </li>
              <li>
                <Link href="/authentication" className="text-white/50 hover:text-white transition-colors text-sm">
                  Authentication Check
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-white/50 hover:text-white transition-colors text-sm">
                  Shoe Care Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter - Column 4 */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-6">
              Newsletter
            </h3>
            <p className="text-white/50 text-sm mb-4">
              Receive quarterly collection drops, cares & latest stories
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#f4cf3e] transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#f4cf3e] text-[#0e1724] text-sm font-bold tracking-wider uppercase hover:bg-[#ffd700] transition-all rounded"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-white/30 text-xs">
            © 2023 B&B Shoes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
