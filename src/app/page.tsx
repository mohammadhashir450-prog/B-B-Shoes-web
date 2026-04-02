import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import SeasonalBanners from '@/components/home/SeasonalBanners'

const WomenSection = dynamic(() => import('@/components/home/WomenSection'), {
  loading: () => <div className="home-section-skeleton" aria-hidden />,
})

const Products = dynamic(() => import('@/components/home/Products'), {
  loading: () => <div className="home-section-skeleton" aria-hidden />,
})

const Story = dynamic(() => import('@/components/home/Story'), {
  loading: () => <div className="home-section-skeleton" aria-hidden />,
})

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <SeasonalBanners />
        <div className="home-deferred-section">
          <WomenSection />
        </div>
        <div className="home-deferred-section">
          <Products />
        </div>
        <div className="home-deferred-section">
          <Story />
        </div>
      </main>
      <Footer />
    </>
  )
}
