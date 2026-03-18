'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Grid, Loader2, ShoppingBag } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

const categories = [
  { key: 'all', name: 'All Products', icon: '🧩' },
  { key: 'new-arrivals', name: 'New Arrivals', icon: '✨' },
  { key: 'sales', name: 'Sales & Discounts', icon: '🏷️' },
  { key: 'sneakers', name: 'Sneakers', icon: '👟' },
  { key: 'loafers', name: 'Loafers', icon: '🥿' },
  { key: 'oxford', name: 'Oxford', icon: '👞' },
  { key: 'formal', name: 'Formal Shoes', icon: '🎩' },
  { key: 'running', name: 'Running Shoes', icon: '🏃' },
  { key: 'basketball', name: 'Basketball', icon: '🏀' },
  { key: 'boots', name: 'Boots', icon: '🥾' },
  { key: 'heritage', name: 'Heritage', icon: '⭐' },
  { key: 'men', name: "Men's Collection", icon: '👔' },
  { key: 'women', name: "Women's Collection", icon: '👗' },
]

export default function CollectionsPage() {
  const { getAllProducts, loading } = useProducts()
  const [activeCategory, setActiveCategory] = useState('all')

  const products = useMemo(() => {
    return getAllProducts()
  }, [getAllProducts])

  const filteredProducts = useMemo(() => {
    const normalize = (value: string | undefined) => (value || '').toLowerCase().trim()

    if (activeCategory === 'all') return products

    if (activeCategory === 'sales') {
      return products.filter((p) => p.isOnSale === true || (p.discount || 0) > 0 || ((p.originalPrice || 0) > p.price))
    }

    if (activeCategory === 'new-arrivals') {
      const tagged = products.filter((p) => p.isNewArrival === true)
      return tagged.length > 0 ? tagged : products.slice(0, 12)
    }

    return products.filter((p) => {
      const category = normalize(p.category)
      const subcategory = normalize(p.subcategory)
      const target = normalize(activeCategory)
      return category === target || subcategory === target
    })
  }, [products, activeCategory])

  const activeCategoryLabel = useMemo(() => {
    return categories.find((c) => c.key === activeCategory)?.name || 'All Products'
  }, [activeCategory])

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
              All <span className="text-[#D4AF37]">Products</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Explore the complete portfolio of premium footwear
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`rounded-lg p-8 text-center transition-all group border ${
                  activeCategory === category.key
                    ? 'bg-[#D4AF37] text-[#0B101E] border-[#D4AF37]'
                    : 'bg-[#1A2435] hover:bg-[#243048] text-white border-white/5 hover:border-[#D4AF37]/30'
                }`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {category.name}
                </h3>
                <div className={`flex items-center justify-center gap-2 text-sm font-semibold transition-opacity ${
                  activeCategory === category.key ? 'text-[#0B101E]' : 'text-[#D4AF37] opacity-0 group-hover:opacity-100'
                }`}>
                  <span>{activeCategory === category.key ? 'Active' : 'Explore'}</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>

          {/* All Products Grid */}
          <div id="all-products-grid" className="mt-14">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Grid className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-white text-2xl font-bold">{activeCategoryLabel}</h2>
              </div>
              {!loading && (
                <p className="text-gray-400 text-sm">{filteredProducts.length} items</p>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
                <p className="text-gray-400 mb-8">Try another category filter or add matching products from admin panel.</p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="inline-block bg-[#D4AF37] hover:bg-[#F4CE5C] text-[#0B101E] font-bold py-3 px-8 rounded-full transition-all"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {product.discount ? (
                        <div className="absolute top-3 left-3 z-10 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                          -{product.discount}%
                        </div>
                      ) : null}
                      {product.isNewArrival ? (
                        <div className="absolute top-3 right-3 z-10 bg-green-600 text-white px-2 py-1 rounded-md text-[10px] font-bold tracking-wider">
                          NEW
                        </div>
                      ) : null}
                      <Image
                        src={product.image || '/images/placeholder.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={product.image?.includes('cloudinary')}
                      />
                    </div>

                    <div className="p-4">
                      <p className="text-gray-500 text-[10px] tracking-[0.15em] uppercase font-semibold mb-1">
                        {product.brand || product.category}
                      </p>
                      <h3 className="text-gray-900 font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">{product.category}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[#0B101E] font-bold text-lg">PKR {product.price.toLocaleString()}</span>
                        {product.originalPrice ? (
                          <span className="text-gray-400 text-sm line-through">PKR {product.originalPrice.toLocaleString()}</span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
