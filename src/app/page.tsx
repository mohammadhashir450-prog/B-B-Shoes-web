'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import Curated from '@/components/home/Curated'
import Products from '@/components/home/Products'
import Story from '@/components/home/Story'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <Curated />
        <Products />
        <Story />
      </main>
      <Footer />
    </>
  )
}
