'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, User, Bell, Lock, Eye, Globe, Palette, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Loading state
  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0B101E] pt-24 pb-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!session?.user) return null

  const user = session.user
  const userEmail = user.email || 'No email available'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B101E] pt-24 pb-16">
        <div className="max-w-[1000px] mx-auto px-6 md:px-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-white">Settings</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="text-[#D4AF37]">Settings</span>
            </h1>
            <p className="text-gray-400">Manage your account preferences</p>
          </div>

          <div className="space-y-6">
            
            {/* Account Settings */}
            <div className="bg-[#1A2435] rounded-lg border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <User size={24} className="text-[#D4AF37]" />
                  <h2 className="text-white text-xl font-bold">Account Settings</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Email Address</p>
                    <p className="text-gray-400 text-sm break-all">{userEmail}</p>
                  </div>
                  <button className="px-4 py-2 bg-[#D4AF37] text-[#0B101E] text-sm font-bold rounded hover:bg-[#C4A037] transition-all whitespace-nowrap ml-4">
                    Change
                  </button>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Phone Number</p>
                    <p className="text-gray-400 text-sm italic">Not provided</p>
                  </div>
                  <button className="px-4 py-2 bg-[#D4AF37] text-[#0B101E] text-sm font-bold rounded hover:bg-[#C4A037] transition-all whitespace-nowrap ml-4">
                    Change
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold mb-1">Password</p>
                    <p className="text-gray-400 text-sm">••••••••</p>
                  </div>
                  <button className="px-4 py-2 bg-[#D4AF37] text-[#0B101E] text-sm font-bold rounded hover:bg-[#C4A037] transition-all">
                    Change
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-[#1A2435] rounded-lg border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Palette size={24} className="text-[#D4AF37]" />
                  <h2 className="text-white text-xl font-bold">Preferences</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-[#D4AF37]" />
                    <div>
                      <p className="text-white font-semibold mb-1">Email Notifications</p>
                      <p className="text-gray-400 text-sm">Receive updates about new arrivals</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      notifications ? 'bg-[#D4AF37]' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      notifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Eye size={20} className="text-[#D4AF37]" />
                    <div>
                      <p className="text-white font-semibold mb-1">Dark Mode</p>
                      <p className="text-gray-400 text-sm">Use dark theme</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-14 h-8 rounded-full transition-colors ${
                      darkMode ? 'bg-[#D4AF37]' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      darkMode ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-[#D4AF37]" />
                    <div>
                      <p className="text-white font-semibold mb-1">Language</p>
                      <p className="text-gray-400 text-sm">English (US)</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#D4AF37] text-[#0B101E] text-sm font-bold rounded hover:bg-[#C4A037] transition-all">
                    Change
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-[#1A2435] rounded-lg border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Lock size={24} className="text-[#D4AF37]" />
                  <h2 className="text-white text-xl font-bold">Privacy & Security</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <button className="w-full text-left px-4 py-3 bg-[#0B101E] text-white rounded hover:bg-[#121A2F] transition-all">
                  Two-Factor Authentication
                </button>
                <button className="w-full text-left px-4 py-3 bg-[#0B101E] text-white rounded hover:bg-[#121A2F] transition-all">
                  Privacy Policy
                </button>
                <button className="w-full text-left px-4 py-3 bg-[#0B101E] text-white rounded hover:bg-[#121A2F] transition-all">
                  Terms of Service
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/20 rounded-lg border border-red-600/30 overflow-hidden">
              <div className="p-6">
                <h3 className="text-red-400 font-bold mb-4">Danger Zone</h3>
                <button className="px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-all">
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
