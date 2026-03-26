'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Grid, Loader2, ShoppingBag } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

const categories = [
  { key: 'all', name: 'All Products' },
  { key: 'new-arrivals', name: 'New Arrivals' },
  { key: 'sales', name: 'Sales & Discounts' },
  { key: 'sneakers', name: 'Sneakers' },
  { key: 'loafers', name: 'Loafers' },
  { key: 'formal', name: 'Formal Shoes' },
  { key: 'running', name: 'Running Shoes' },
  { key: 'boots', name: 'Boots' },
  { key: 'slippers', name: 'Slippers' },
  { key: 'peshawari-chappal', name: 'Peshawari Chappal' },
  { key: 'kids', name: 'Kids Collection' },
  { key: 'men', name: "Men's Collection" },
  { key: 'women', name: "Women's Collection" },
]

export default function CollectionsPage() {
  const router = useRouter()
  const { getAllProducts, getSaleProducts, getNewArrivals, getProductsByCategory, loading } = useProducts()
  const [requestedCategory, setRequestedCategory] = useState('all')

  useEffect(() => {
    const updateCategoryFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      setRequestedCategory(params.get('category') || 'all')
    }

    updateCategoryFromUrl()
    window.addEventListener('popstate', updateCategoryFromUrl)

    return () => {
      window.removeEventListener('popstate', updateCategoryFromUrl)
    }
  }, [])

  const activeCategory = useMemo(() => {
    const isValid = categories.some((category) => category.key === requestedCategory)
    return isValid ? requestedCategory : 'all'
  }, [requestedCategory])

  const products = useMemo(() => {
    return getAllProducts()
  }, [getAllProducts])

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products

    if (activeCategory === 'sales') {
      return getSaleProducts()
    }

    if (activeCategory === 'new-arrivals') {
      return getNewArrivals()
    }

    return getProductsByCategory(activeCategory)
  }, [products, activeCategory, getSaleProducts, getNewArrivals, getProductsByCategory])

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

          {/* All Products Grid */}
          <div id="all-products-grid" className="mt-6">
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
                  onClick={() => router.push('/collections')}
                  className="inline-block bg-[#D4AF37] hover:bg-[#F4CE5C] text-[#0B101E] font-bold py-3 px-8 rounded-full transition-all"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
