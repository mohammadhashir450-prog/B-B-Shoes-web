import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import CuratedCollections from '@/components/home/CuratedCollections'

const Products = dynamic(() => import('@/components/home/Products'), {
  loading: () => <div className="home-section-skeleton" aria-hidden />,
})

const Story = dynamic(() => import('@/components/home/Story'), {
  loading: () => <div className="home-section-skeleton" aria-hidden />,
})

const FloatingSocials = dynamic(() => import('@/components/common/FloatingSocials'), {
  ssr: false,
})

// 3D Shoe Canvas — loaded only on client (WebGL requires browser)
const ShoeCanvas = dynamic(() => import('@/components/3d/ShoeCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-[#06080F]">
      <span className="text-white/30 text-sm tracking-widest uppercase animate-pulse">Loading 3D…</span>
    </div>
  ),
})

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />

        {/* ── 3D Shoe Section ── */}
        <section className="w-full bg-[#06080F] py-16">
          <div className="max-w-[1320px] mx-auto px-6 md:px-10 text-center mb-8">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#D4AF37] mb-3">
              Interactive 3D
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Explore the Craft
            </h2>
            <p className="mt-3 text-white/40 text-sm max-w-md mx-auto">
              Drag to rotate &amp; inspect every angle
            </p>
          </div>
          <ShoeCanvas />
        </section>

        <div className="home-deferred-section">
          <CuratedCollections />
        </div>
        <div className="home-deferred-section">
          <Products />
        </div>
        <div className="home-deferred-section">
          <Story />
        </div>
        <FloatingSocials />
      </main>
      <Footer />
    </>
  )
}
