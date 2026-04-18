'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppContactCard from '@/components/common/WhatsAppContactCard'
import { ChevronRight, User, Mail, Phone, MapPin, Package, Heart, Settings, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0B101E] pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!session?.user) {
    return null
  }

  const user = session.user
  const userName = user.name || 'User'
  const userEmail = user.email || 'No email available'
  const userInitial = userName.charAt(0).toUpperCase()
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
            <span className="text-white">Profile</span>
          </div>

          <div className="grid lg:grid-cols-[300px,1fr] gap-8">
            
            {/* Profile Sidebar */}
            <aside className="space-y-6">
              <div className="bg-[#1A2435] rounded-lg p-6 text-center border border-white/5">
                <div className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#0B101E] text-4xl font-bold">{userInitial}</span>
                </div>
                <h2 className="text-white text-xl font-bold mb-1">{userName}</h2>
                <p className="text-gray-400 text-sm break-all">{userEmail}</p>
              </div>

              <nav className="bg-[#1A2435] rounded-lg border border-white/5">
                <Link href="/my-orders" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-all border-b border-white/5">
                  <Package size={18} />
                  <span className="text-sm">My Orders</span>
                </Link>
                <Link href="/bag" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-all border-b border-white/5">
                  <Heart size={18} />
                  <span className="text-sm">Shopping Bag</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-all">
                  <Settings size={18} />
                  <span className="text-sm">Settings</span>
                </Link>
              </nav>

              <WhatsAppContactCard
                title="Need order help?"
                description="Chat with admin on WhatsApp for order status, product details, payment help, or any quick support."
                templateData={{
                  customerName: userName,
                  customerEmail: userEmail,
                  note: 'I need help with my account or order.',
                }}
              />
            </aside>

            {/* Profile Content */}
            <div className="space-y-6">
              <div className="bg-[#1A2435] rounded-lg p-8 border border-white/5">
                <h3 className="text-white text-xl font-bold mb-6">Personal Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <Mail size={20} className="text-[#D4AF37]" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Email</p>
                      <p className="text-white break-all">{userEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <Phone size={20} className="text-[#D4AF37]" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-white/60 text-sm italic">Not provided</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <MapPin size={20} className="text-[#D4AF37]" />
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Address</p>
                      <p className="text-white/60 text-sm italic">Not provided</p>
                    </div>
                  </div>
                </div>

                <button className="mt-6 px-6 py-3 bg-[#D4AF37] text-[#0B101E] text-sm font-bold tracking-wide uppercase rounded hover:bg-[#C4A037] transition-all">
                  Edit Profile
                </button>
              </div>

              <div className="bg-[#1A2435] rounded-lg p-8 border border-white/5">
                <h3 className="text-white text-xl font-bold mb-6">Recent Orders</h3>
                <div className="text-center py-12">
                  <Package size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No orders yet</p>
                  <Link href="/new-arrivals">
                    <button className="mt-4 px-6 py-3 bg-[#D4AF37] text-[#0B101E] text-sm font-bold tracking-wide uppercase rounded hover:bg-[#C4A037] transition-all">
                      Start Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
