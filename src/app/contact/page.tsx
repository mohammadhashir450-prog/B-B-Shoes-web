'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ChevronDown, ChevronRight, Mail, Phone, MapPin, Send, CreditCard, ArrowRightLeft, Store, Truck, ReceiptText } from 'lucide-react'

export default function ContactPage() {
  const [isReturnPolicyOpen, setIsReturnPolicyOpen] = useState(true)
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
                    <p className="text-gray-400 text-sm">bandbshoessupport@gmail.com</p>
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

              <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#1E2B44] via-[#1A2435] to-[#111A2D] p-6 shadow-[0_16px_40px_-12px_rgba(212,175,55,0.2)]">
                <div className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none" />

                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.35)]">
                    <MapPin size={20} className="text-[#0B101E]" />
                  </div>

                  <div className="flex-1">
                    <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.22em] font-bold mb-2">Flagship Outlet</p>
                    <h3 className="text-white font-bold text-lg mb-2">Visit Us</h3>
                    <p className="text-gray-200/90 text-sm leading-relaxed">
                      Khanewal Rd, opposite to Chase up 2 Rasheed Abad Khushal Colony, Multan, 60000.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] text-white/80">
                        Multan
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[11px] text-[#FFE7A3]">
                        Since 2023
                      </span>
                    </div>
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

              <div className="rounded-lg border border-[#D4AF37]/25 bg-gradient-to-br from-[#1E2B44] via-[#1A2435] to-[#111A2D] p-6 shadow-[0_10px_30px_rgba(212,175,55,0.12)]">
                <button
                  type="button"
                  onClick={() => setIsReturnPolicyOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                  aria-expanded={isReturnPolicyOpen}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#0B101E] flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base md:text-lg">Return Policy & Terms</h3>
                      <p className="text-gray-300 text-sm mt-1">Tap to view exchange process and conditions</p>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-[#D4AF37] transition-transform duration-300 ${isReturnPolicyOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${isReturnPolicyOpen ? 'grid-rows-[1fr] mt-5 opacity-100' : 'grid-rows-[0fr] mt-0 opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-3 border-t border-white/10 pt-4 text-sm text-gray-300">
                      <p className="font-semibold text-[#FFE8A6]">Returns and exchanges are accepted within 7 days with valid purchase proof.</p>

                      <div className="flex items-start gap-3">
                        <Store size={17} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                        <p>If a customer wants an exchange, they may visit the company outlet directly.</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Truck size={17} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                        <p>Alternatively, the customer can send the product to the outlet by courier after paying courier charges. Once received, the company will deliver a replacement based on the customer&apos;s requirement.</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <ReceiptText size={17} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
                        <p>For shoe/product claims, visiting the outlet is strongly recommended with a proper purchase receipt and payment receipt.</p>
                      </div>
                    </div>
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