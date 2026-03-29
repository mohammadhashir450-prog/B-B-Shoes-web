'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import Curated from '@/components/home/Curated'
import Products from '@/components/home/Products'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <Curated />
        <Products />
      </main>
      <Footer />
    </>
  )
}
