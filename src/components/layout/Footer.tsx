'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0B101E] border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#121A2F]/55 border border-white/10 rounded-2xl p-5 md:p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]">
          <div className="max-w-xl">
            <Link href="/" className="text-xl md:text-2xl font-serif font-bold text-white hover:text-[#D4AF37] transition-colors">
              B&B Shoes
            </Link>
            <p className="mt-2 text-white/65 text-xs md:text-sm">
              Shop Address: Khanewal Rd, opposite to Chase up 2 Rasheed Abad Khushal Colony, Multan, 60000.
            </p>
            <p className="text-[#D4AF37]/80 text-[11px] tracking-[0.2em] uppercase font-semibold mt-1">
              Since 2023
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/60 pt-1">
            <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-white/10 text-center md:text-left">
          <p className="text-white/40 text-xs md:text-sm">
            © {new Date().getFullYear()} B&B Shoes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}