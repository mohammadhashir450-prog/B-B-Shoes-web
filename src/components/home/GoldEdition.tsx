'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useState } from 'react'

const products = [
  {
    id: 1,
    name: "Midnight Monarch",
    brand: "LUXURY DETAILS",
    price: "$1,299",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
    badge: "ARTISAN"
  },
  {
    id: 2,
    name: "Vanguard Oneless",
    brand: "SIGNATURE SERIES",
    price: "$850",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=500&q=80",
    badge: "ARTISAN"
  },
  {
    id: 3,
    name: "Toscana Loafer",
    brand: "MILAN CRAFT",
    price: "$975",
    image: "https://images.unsplash.com/photo-1478827217976-799def0b44f5?w=500&q=80",
    badge: "ARTISAN"
  },
  {
    id: 4,
    name: "Versailles Boot",
    brand: "HERITAGE LINE",
    price: "$1,450",
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500&q=80",
    badge: "ARTISAN"
  }
]

export default function GoldEdition() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <section className="bg-[#0e1724] py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Gold Edition
            </h2>
            <div className="w-20 h-0.5 bg-[#f4cf3e]"></div>
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={prevSlide}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-[#f4cf3e] hover:text-[#f4cf3e] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-[#f4cf3e] hover:text-[#f4cf3e] transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#f4cf3e] text-[#0e1724] px-3 py-1.5 text-[10px] font-extrabold tracking-[0.15em] uppercase shadow-md">
                    {product.badge}
                  </span>
                </div>
                {/* Wishlist */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-md hover:scale-110">
                  <Heart size={18} className="text-gray-800" strokeWidth={2} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-2 font-semibold">
                  {product.brand}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-[#f4cf3e] mb-5">
                  {product.price}
                </p>
                <button className="w-full bg-[#0e1724] text-white py-3.5 rounded-md hover:bg-[#1a2332] transition-all font-bold text-xs tracking-[0.15em] uppercase shadow-md hover:shadow-lg">
                  ADD TO BAG
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
