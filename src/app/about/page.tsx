'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Award, Users, Globe, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E] pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-white">About Us</span>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About <span className="text-[#D4AF37]">B&B Shoes</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Crafting luxury footwear excellence since 1924
            </p>
          </div>

          {/* Story Section */}
          <div className="bg-[#1A2435] rounded-lg p-8 md:p-12 mb-8 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Award size={28} className="text-[#0B101E]" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">Our Heritage</h2>
                <p className="text-[#D4AF37] text-sm">Since 1924</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              For nearly a century, B&B Shoes has been at the forefront of luxury footwear craftsmanship. 
              Founded in Milano, our dedication to perfection has made us the choice of discerning 
              customers worldwide.
            </p>
            
            <p className="text-gray-300 leading-relaxed">
              Every pair of B&B Shoes undergoes 180 individual man-hours of meticulous craftsmanship. 
              From hand-selecting the finest Italian leather to the final polish, we maintain standards 
              that have defined luxury for generations.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1A2435] rounded-lg p-8 text-center border border-white/5">
              <Users size={40} className="text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-3">Expert Artisans</h3>
              <p className="text-gray-400 text-sm">
                Our master craftsmen bring decades of experience to every creation
              </p>
            </div>
            
            <div className="bg-[#1A2435] rounded-lg p-8 text-center border border-white/5">
              <Globe size={40} className="text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-3">Global Presence</h3>
              <p className="text-gray-400 text-sm">
                Milano • London • New York • Tokyo
              </p>
            </div>
            
            <div className="bg-[#1A2435] rounded-lg p-8 text-center border border-white/5">
              <Heart size={40} className="text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-3">Passion for Quality</h3>
              <p className="text-gray-400 text-sm">
                Every detail matters in our pursuit of perfection
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#1A2435] rounded-lg p-6 text-center border border-white/5">
              <p className="text-4xl font-bold text-[#D4AF37] mb-2">100+</p>
              <p className="text-gray-400 text-sm">Years Experience</p>
            </div>
            <div className="bg-[#1A2435] rounded-lg p-6 text-center border border-white/5">
              <p className="text-4xl font-bold text-[#D4AF37] mb-2">50K+</p>
              <p className="text-gray-400 text-sm">Happy Customers</p>
            </div>
            <div className="bg-[#1A2435] rounded-lg p-6 text-center border border-white/5">
              <p className="text-4xl font-bold text-[#D4AF37] mb-2">180</p>
              <p className="text-gray-400 text-sm">Hours Per Pair</p>
            </div>
            <div className="bg-[#1A2435] rounded-lg p-6 text-center border border-white/5">
              <p className="text-4xl font-bold text-[#D4AF37] mb-2">4</p>
              <p className="text-gray-400 text-sm">Global Locations</p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
