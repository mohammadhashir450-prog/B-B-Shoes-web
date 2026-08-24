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

const ReviewsSlider = dynamic(() => import('@/components/home/ReviewsSlider'), {
  loading: () => <div className="home-section-skeleton" aria-hidden />,
  ssr: false,
})

const FloatingSocials = dynamic(() => import('@/components/common/FloatingSocials'), {
  ssr: false,
})


export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <div className="home-deferred-section">
          <CuratedCollections />
        </div>
        <div className="home-deferred-section">
          <Products />
        </div>
        <div className="home-deferred-section">
          <Story />
        </div>
        <div className="home-deferred-section">
          <ReviewsSlider />
        </div>

        <FloatingSocials />
      </main>
      <Footer />
    </>
  )
}
