'use client'

import Link from 'next/link'
import { Facebook, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0B101E] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 inline-block">
              <div className="flex items-center gap-2.5 mb-1">
                <svg width="38" height="24" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 28 Q4 32 8 32 L44 32 Q48 32 48 28 L48 26 L4 26 Z" fill="#D4AF37"/>
                  <path d="M4 26 L4 16 Q4 10 10 8 L24 7 Q30 7 34 10 L48 26 Z" fill="#D4AF37"/>
                  <path d="M12 18 C16 15 22 15 26 17" stroke="#0B101E" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <span className="text-[#D4AF37] text-2xl font-bold tracking-tight">B&B Shoes</span>
              </div>
              <p className="text-[#D4AF37]/50 text-[10px] tracking-[0.28em] uppercase">Brand You Like</p>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              Elevating the standard of luxury footwear.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Multan • Est. 2023
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 - Collections */}
          <div>
            <h3 className="text-white text-sm font-bold tracking-[0.15em] uppercase mb-5">
              COLLECTIONS
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  The Heritage Series
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Modern Minimalist
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Limited Collaborations
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Bespoke Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Client Care */}
          <div>
            <h3 className="text-white text-sm font-bold tracking-[0.15em] uppercase mb-5">
              CLIENT CARE
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Private Consultation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Authenticity Check
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Shoe Care Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-white text-sm font-bold tracking-[0.15em] uppercase mb-5">
              THE INSIDER
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Receive invitations to private viewings and early access.
            </p>
            <div className="flex gap-0">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button className="px-8 py-3 bg-[#D4AF37] text-[#0B101E] text-xs font-bold tracking-[0.15em] uppercase hover:bg-white transition-all">
                JOIN
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <p className="text-gray-500 text-xs text-center">
            © 2023 B&B Shoes Luxury Footwear. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
