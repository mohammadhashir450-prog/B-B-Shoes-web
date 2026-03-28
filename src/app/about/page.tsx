'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Award, Users, Globe, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E] pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(212,175,55,0.16),transparent_38%),radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#0B101E_0%,#111A2D_55%,#0B101E_100%)] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          
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
              Crafting luxury footwear excellence since 2023
            </p>
          </div>

          {/* Story Section */}
          <div className="bg-gradient-to-br from-[#1D2A42] via-[#1A2435] to-[#111A2D] rounded-2xl p-8 md:p-12 mb-8 border border-[#D4AF37]/20 shadow-[0_26px_60px_-26px_rgba(0,0,0,0.65)] transform-gpu transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-28px_rgba(212,175,55,0.35)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Award size={28} className="text-[#0B101E]" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">A Century of Quiet Luxury</h2>
                <p className="text-[#D4AF37] text-sm">Since 2023</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              B&B Shoes is a premium footwear store focused on quality, comfort, and long-lasting style.
              We carefully select materials and pay attention to finishing so every pair looks elegant and feels reliable in daily wear.
            </p>
            
            <p className="text-gray-300 leading-relaxed">
              From classic formal shoes to modern everyday designs, our goal is simple:
              give customers trusted quality at a premium standard with clean design and strong build.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#1E2B44] via-[#1A2435] to-[#111A2D] rounded-2xl p-8 text-center border border-white/10 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.58)] transform-gpu transition-all duration-500 hover:-translate-y-1">
              <Users size={40} className="text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-3">Expert Artisans</h3>
              <p className="text-gray-400 text-sm">
                Our master craftsmen bring decades of experience to every creation
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1E2B44] via-[#1A2435] to-[#111A2D] rounded-2xl p-8 text-center border border-white/10 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.58)] transform-gpu transition-all duration-500 hover:-translate-y-1">
              <Globe size={40} className="text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-3">Global Presence</h3>
              <p className="text-gray-400 text-sm">
                Milano • London • New York • Tokyo
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1E2B44] via-[#1A2435] to-[#111A2D] rounded-2xl p-8 text-center border border-white/10 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.58)] transform-gpu transition-all duration-500 hover:-translate-y-1">
              <Heart size={40} className="text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-3">Passion for Quality</h3>
              <p className="text-gray-400 text-sm">
                Every detail matters in our pursuit of perfection
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#1E2B44] via-[#1A2435] to-[#111A2D] rounded-2xl p-6 text-center border border-white/10 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.58)] transform-gpu transition-all duration-500 hover:-translate-y-1">
              <p className="text-4xl font-bold text-[#D4AF37] mb-2">100+</p>
              <p className="text-gray-400 text-sm">Years Experience</p>
            </div>
            <div className="bg-gradient-to-br from-[#1E2B44] via-[#1A2435] to-[#111A2D] rounded-2xl p-6 text-center border border-white/10 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.58)] transform-gpu transition-all duration-500 hover:-translate-y-1">
              <p className="text-4xl font-bold text-[#D4AF37] mb-2">50K+</p>
              <p className="text-gray-400 text-sm">Happy Customers</p>
            </div>
            <div className="bg-gradient-to-br from-[#1E2B44] via-[#1A2435] to-[#111A2D] rounded-2xl p-6 text-center border border-white/10 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.58)] transform-gpu transition-all duration-500 hover:-translate-y-1">
              <p className="text-4xl font-bold text-[#D4AF37] mb-2">180</p>
              <p className="text-gray-400 text-sm">Hours Per Pair</p>
            </div>
            <div className="bg-gradient-to-br from-[#1E2B44] via-[#1A2435] to-[#111A2D] rounded-2xl p-6 text-center border border-white/10 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.58)] transform-gpu transition-all duration-500 hover:-translate-y-1">
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
