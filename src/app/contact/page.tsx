'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronRight, Mail, Phone, MapPin, Send, CreditCard } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for contacting us! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

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
            <span className="text-white">Contact Us</span>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get in <span className="text-[#D4AF37]">Touch</span>
            </h1>
            <p className="text-gray-400 text-lg">
              We&apos;d love to hear from you
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            
            {/* Contact Form */}
            <div className="bg-[#1A2435] rounded-lg p-8 border border-white/5">
              <h2 className="text-white text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0B101E] border border-white/10 rounded px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0B101E] border border-white/10 rounded px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#0B101E] border border-white/10 rounded px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full bg-[#0B101E] border border-white/10 rounded px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-[#D4AF37] text-[#0B101E] py-3 rounded font-bold tracking-wide uppercase hover:bg-[#C4A037] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-[#1A2435] rounded-lg p-6 border border-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[#0B101E]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Email Us</h3>
                    <p className="text-gray-400 text-sm">b&bshoessupport@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A2435] rounded-lg p-6 border border-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#0B101E]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Call Us</h3>
                    <p className="text-gray-400 text-sm">03361673742</p>
                    <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A2435] rounded-lg p-6 border border-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-[#0B101E]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Visit Us</h3>
                    <p className="text-gray-400 text-sm">Khanewal Rd, opposite to Chase up 2,</p>
                    <p className="text-gray-400 text-sm">Rasheed Abad Khushal Colony, Multan, 60000.</p>
                  </div>
                </div>
              </div>

              <div id="for-transactions" className="bg-[#1A2435] rounded-lg p-6 border border-white/5 scroll-mt-28">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard size={20} className="text-[#0B101E]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">For Transactions</h3>
                    <p className="text-gray-400 text-sm">JazzCash Account No# 03068846624</p>
                    <p className="text-gray-400 text-sm">Meezan Bank Account No# 05100110600803</p>
                  </div>
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