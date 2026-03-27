'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HoverSwapImage from '@/components/common/HoverSwapImage'
import { ChevronRight, Filter, Loader2 } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

const accessoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'socks', label: 'Socks' },
  { value: 'polish', label: 'Polish' },
  { value: 'brushes', label: 'Brushes' },
]

const normalizeText = (value?: string) =>
  (value || '')
    .toLowerCase()
    .trim()
    .replace(/[\s'’]+/g, '')

export default function AccessoriesPage() {
  const [selectedType, setSelectedType] = useState('all')
  const { getProductsByCategory, loading } = useProducts()

  const accessoriesProducts = useMemo(() => {
    return getProductsByCategory('Accessories')
  }, [getProductsByCategory])

  const filteredProducts = useMemo(() => {
    if (selectedType === 'all') return accessoriesProducts

    const target = normalizeText(selectedType)

    return accessoriesProducts.filter((product) => {
      const category = normalizeText(product.category)
      const subcategory = normalizeText(product.subcategory)
      const name = normalizeText(product.name)
      const description = normalizeText(product.description)

      return (
        category === target ||
        subcategory === target ||
        name.includes(target) ||
        description.includes(target)
      )
    })
  }, [accessoriesProducts, selectedType])

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
            <span className="text-white">Accessories</span>
          </div>

          <div className="text-center mb-14">
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold mb-4">CARE AND DETAILS</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5">
              Premium <span className="text-[#D4AF37]">Accessories</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Finishing essentials for your footwear collection including socks, polish, and brushes.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
            <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-bold mr-2">
              <Filter size={14} />
              Filter
            </span>
            {accessoryFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedType(filter.value)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                  selectedType === filter.value
                    ? 'bg-[#D4AF37] text-[#0B101E]'
                    : 'bg-[#1A2435] text-white hover:bg-[#243048] border border-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Loading accessories...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-3xl border border-white/10">
              <div className="text-6xl mb-4">🧰</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Accessories Available Yet</h3>
              <p className="text-gray-400 mb-6">Add products in admin with category Accessories.</p>
              <Link
                href="/collections"
                className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group block bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <HoverSwapImage
                      primaryImage={product.image}
                      secondaryImage={product.secondaryImage}
                      alt={product.name}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      fitClassName="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white font-bold text-sm uppercase">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-gray-500 text-[10px] tracking-[0.15em] uppercase font-semibold mb-1">
                      {product.subcategory || product.category}
                    </p>
                    <h3 className="text-gray-900 font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-1">{product.description || 'Premium accessory by B&B'}</p>

                    <div className="flex items-center gap-2">
                      <span className="text-[#0B101E] font-bold text-lg">PKR {product.price.toLocaleString()}</span>
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <span className="text-gray-400 text-sm line-through">PKR {product.originalPrice.toLocaleString()}</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
