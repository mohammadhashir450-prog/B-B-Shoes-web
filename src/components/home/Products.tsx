'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: string
  isOnSale?: boolean
  isNewArrival?: boolean
  discount?: number
  originalPrice?: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          // Get first 4 regular products (not on sale, not new arrivals)
          const regularProducts = data.products
            .filter((p: Product) => !p.isOnSale && !p.isNewArrival)
            .slice(0, 4)
          setProducts(regularProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="bg-[#0B101E] py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="bg-[#0B101E] py-20">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Products Available</h3>
            <p className="text-gray-400">New products will appear here soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#0B101E] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">The Gold Edition</h2>
            <p className="text-gray-400 text-sm">Exclusive releases from our luxury artisans</p>
          </div>
          
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-lg overflow-hidden shadow-xl"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#D4AF37] text-[#0B101E] px-3 py-1 text-[9px] font-extrabold tracking-[0.15em] uppercase">
                      ARTISAN
                    </span>
                  </div>
                  
                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Heart size={16} className="text-gray-800" />
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-gray-500 text-[9px] tracking-[0.2em] uppercase font-semibold mb-1">
                    {product.brand}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-[#D4AF37] mb-4">
                    PKR {product.price.toLocaleString()}
                  </p>
                  <button className="w-full bg-[#0B101E] text-white py-3 rounded text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#121A2F] transition-all">
                    VIEW DETAILS
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
