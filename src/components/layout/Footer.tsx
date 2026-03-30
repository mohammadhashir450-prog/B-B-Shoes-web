'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E6E6E6]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white border border-[#E6E6E6] rounded-2xl p-5 md:p-6 shadow-[0_20px_40px_-20px_rgba(24,32,43,0.15)]">
          <div className="max-w-xl">
            <Link href="/" className="text-xl md:text-2xl font-serif font-bold text-[#18202B] hover:text-[#A97A18] transition-colors">
              B&B Shoes
            </Link>
            <p className="mt-2 text-[#4F5A69] text-xs md:text-sm">
              Shop Address: Khanewal Rd, opposite to Chase up 2 Rasheed Abad Khushal Colony, Multan, 60000.
            </p>
            <p className="text-[#A97A18] text-[11px] tracking-[0.2em] uppercase font-semibold mt-1">
              Since 2023
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#4F5A69] pt-1 w-full md:w-auto">
            <Link href="/collections" className="hover:text-[#18202B] transition-colors">Collections</Link>
            <Link href="/contact" className="hover:text-[#18202B] transition-colors">Contact</Link>
            <Link href="/about" className="hover:text-[#18202B] transition-colors">About</Link>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-[#E6E6E6] text-center md:text-left">
          <p className="text-[#7A8492] text-xs md:text-sm">
            © {new Date().getFullYear()} B&B Shoes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}