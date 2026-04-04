'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HoverSwapImage from '@/components/common/HoverSwapImage'
import { ChevronRight, Loader2, Filter } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'

const kidsFilterOptions = [
  { value: 'all', label: 'All' },
  { value: 'slippers', label: 'Slippers' },
  { value: 'sandals', label: 'Sandals' },
  { value: 'joggers', label: 'Joggers' },
  { value: 'loafers', label: 'Loafers' },
  { value: 'peshawarichappal', label: 'Peshawari Chappal' },
]

const normalizeText = (value?: string) =>
  (value || '')
    .toLowerCase()
    .trim()
    .replace(/[\s'’]+/g, '')

export default function KidsPage() {
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const { getProductsByCategory, loading } = useProducts()
  const productsPerPage = 6
  
  const products = useMemo(() => {
    return getProductsByCategory('Kids')
  }, [getProductsByCategory])

  const filteredProducts = useMemo(() => {
    if (selectedStyle === 'all') return products

    const target = normalizeText(selectedStyle)

    return products.filter((product) => {
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
  }, [products, selectedStyle])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedStyle])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage))
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage
    return filteredProducts.slice(startIndex, startIndex + productsPerPage)
  }, [filteredProducts, currentPage])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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
            <span className="text-white">Kids Collection</span>
          </div>

          {/* Hero Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold mb-4">
                YOUNG EXPLORERS
              </p>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                Premium <span className="text-[#D4AF37]">Kids</span> Collection
              </h1>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Comfort and style for the next generation. Our kids collection combines durability with the premium craftsmanship B&B is known for.
              </p>
            </div>
          </div>

          {/* Kids Products */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Featured <span className="text-[#D4AF37]">Styles</span>
            </h2>

            <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
              <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-bold mr-2">
                <Filter size={14} />
                Filter
              </span>
              {kidsFilterOptions.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                    selectedStyle === style.value
                      ? 'bg-[#D4AF37] text-[#0B101E]'
                      : 'bg-[#1A2435] text-white hover:bg-[#243048] border border-white/10'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
                <p className="text-gray-400 text-sm">Loading kids collection...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-3xl border border-white/10">
                <div className="text-6xl mb-4">👟</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Matching Kids Products</h3>
                <p className="text-gray-400 mb-6">Try another style filter or add products from admin panel.</p>
                <Link 
                  href="/"
                  className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all duration-300"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProducts.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className="group">
                    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-300">
                      <div className="relative aspect-square bg-gray-100 overflow-hidden border border-[#06080F]/45 rounded-xl shadow-[0_10px_24px_-18px_rgba(6,8,15,0.55)]">
                        <HoverSwapImage
                          primaryImage={product.image}
                          secondaryImage={product.secondaryImage}
                          alt={product.name}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          fitClassName="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="text-white font-bold text-lg uppercase">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-gray-900 font-bold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[#D4AF37] font-bold text-lg">PKR {product.price.toLocaleString()}</p>
                            {product.originalPrice && product.originalPrice > product.price ? (
                              <p className="text-gray-500 text-xs line-through mt-1">PKR {product.originalPrice.toLocaleString()}</p>
                            ) : null}
                          </div>
                          {product.isOnSale && (
                            <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">Sale</span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>

                <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#0B101E] font-bold text-sm flex items-center justify-center">
                  {currentPage}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
