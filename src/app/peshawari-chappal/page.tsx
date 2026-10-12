'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/common/ProductCard'
import { ChevronRight, Loader2 } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

export default function PeshawariChappalPage() {
  const { getProductsByCategory, loading } = useProducts()

  const products = useMemo(() => {
    return getProductsByCategory('Peshawari Chappal')
  }, [getProductsByCategory])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E] pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-white">Peshawari Chappal</span>
          </div>

          <div className="text-center mb-14">
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold mb-4">
              TRADITIONAL COMFORT
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Peshawari <span className="text-[#D4AF37]">Chappal</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Classic traditional footwear with modern craftsmanship. Authentic Peshawari Chappals designed for comfort and style.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#1A2435] rounded-2xl border border-white/10">
              <div className="text-6xl mb-4">👞</div>
              <h3 className="text-2xl font-bold text-white mb-3">No Peshawari Chappals Added Yet</h3>
              <p className="text-gray-400 mb-8">Add products from admin and set classification to Peshawari Chappal.</p>
              <Link
                href="/collections"
                className="inline-block bg-[#D4AF37] text-[#0B101E] px-8 py-3 rounded-lg font-bold hover:bg-[#C19B2C] transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} priority={index < 3} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
