'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Grid, ChevronRight } from 'lucide-react'

const categories = [
  { name: 'New Arrivals', href: '/new-arrivals', icon: '✨' },
  { name: 'Oxford Series', href: '/collections/oxford', icon: '👞' },
  { name: 'Loafers', href: '/collections/loafers', icon: '🥿' },
  { name: 'Sneakers', href: '/collections/sneakers', icon: '👟' },
  { name: 'Boots', href: '/collections/boots', icon: '🥾' },
  { name: 'Heritage Collection', href: '/heritage', icon: '⭐' },
  { name: "Men's Collection", href: '/men', icon: '👔' },
  { name: "Women's Collection", href: '/women', icon: '👗' }
]

export default function CollectionsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E] pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-white">All Categories</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              All <span className="text-[#D4AF37]">Categories</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Explore our curated collection of premium luxury footwear
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="bg-[#1A2435] hover:bg-[#243048] rounded-lg p-8 text-center transition-all group border border-white/5 hover:border-[#D4AF37]/30"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-white text-lg font-bold mb-2">
                  {category.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-[#D4AF37] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
