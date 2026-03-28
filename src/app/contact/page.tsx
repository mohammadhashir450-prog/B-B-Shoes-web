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
      <main className="min-h-screen bg-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(212,175,55,0.06),transparent_38%),radial-gradient(circle_at_88%_16%,rgba(0,0,0,0.02),transparent_30%),linear-gradient(180deg,#ffffff_0%,#F5F5F5_55%,#ffffff_100%)] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-[#4F5A69] hover:text-[#D4AF37] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-[#8892A0]" />
            <span className="text-[#0B101E]">Contact Us</span>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0B101E] mb-4">
              Get in <span className="text-[#D4AF37]">Touch</span>
            </h1>
            <p className="text-[#4F5A69] text-lg">
              We&apos;d love to hear from you
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8 [perspective:1400px]">
            
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white via-[#FAFAFA] to-[#F5F5F5] rounded-2xl p-8 border border-[#D4AF37]/30 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transform-gpu transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(212,175,55,0.15)]">
              <h2 className="text-[#0B101E] text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#4F5A69] text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#0B101E] focus:border-[#D4AF37] focus:outline-none transition-all focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)]"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-[#4F5A69] text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#0B101E] focus:border-[#D4AF37] focus:outline-none transition-all focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)]"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-[#4F5A69] text-sm mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#0B101E] focus:border-[#D4AF37] focus:outline-none transition-all focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)]"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label className="block text-[#4F5A69] text-sm mb-2">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full bg-white border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#0B101E] focus:border-[#D4AF37] focus:outline-none transition-all focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4CE5C] text-[#0B101E] py-3 rounded-xl font-bold tracking-wide uppercase hover:from-[#C4A037] hover:to-[#E3BA48] transition-all flex items-center justify-center gap-2 shadow-[0_12px_24px_-10px_rgba(212,175,55,0.6)] hover:shadow-[0_16px_30px_-12px_rgba(212,175,55,0.75)]"
                >
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white via-[#FAFAFA] to-[#F5F5F5] rounded-2xl p-6 border border-[#D4AF37]/20 shadow-[0_8px_20px_rgba(0,0,0,0.06)] transform-gpu transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[#0B101E]" />
                  </div>
                  <div>
                    <h3 className="text-[#0B101E] font-bold mb-2">Email Us</h3>
                    <p className="text-[#4F5A69] text-sm">bandbshoessupport@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white via-[#FAFAFA] to-[#F5F5F5] rounded-2xl p-6 border border-[#D4AF37]/20 shadow-[0_8px_20px_rgba(0,0,0,0.06)] transform-gpu transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#0B101E]" />
                  </div>
                  <div>
                    <h3 className="text-[#0B101E] font-bold mb-2">Call Us</h3>
                    <p className="text-[#4F5A69] text-sm">03361673742</p>
                    <p className="text-[#4F5A69] text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-white via-[#FFFAF0] to-[#F5F5F5] p-6 shadow-[0_8px_24px_rgba(212,175,55,0.1)]">
                <div className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-[#D4AF37]/5 blur-2xl pointer-events-none" />

                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(212,175,55,0.2)]">
                    <MapPin size={20} className="text-[#0B101E]" />
                  </div>

                  <div className="flex-1">
                    <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.22em] font-bold mb-2">Flagship Outlet</p>
                    <h3 className="text-[#0B101E] font-bold text-lg mb-2">Visit Us</h3>
                    <p className="text-[#4F5A69] text-sm leading-relaxed">
                      Khanewal Rd, opposite to Chase up 2 Rasheed Abad Khushal Colony, Multan, 60000.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#E8DCC8] border border-[#D4AF37]/20 text-[11px] text-[#4F5A69]">
                        Multan
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#FFF9F0] border border-[#D4AF37]/30 text-[11px] text-[#D4AF37]">
                        Since 2023
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div id="for-transactions" className="bg-gradient-to-br from-white via-[#FAFAFA] to-[#F5F5F5] rounded-2xl p-6 border border-[#D4AF37]/20 scroll-mt-28 shadow-[0_8px_20px_rgba(0,0,0,0.06)] transform-gpu transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard size={20} className="text-[#0B101E]" />
                  </div>
                  <div>
                    <h3 className="text-[#0B101E] font-bold mb-2">For Transactions</h3>
                    <p className="text-[#4F5A69] text-sm">JazzCash Account No# 03068846624</p>
                    <p className="text-[#4F5A69] text-sm">Meezan Bank Account No# 05100110600803</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-white via-[#FFFAF0] to-[#F5F5F5] p-6 shadow-[0_8px_24px_rgba(212,175,55,0.08)] transform-gpu transition-all duration-500 hover:-translate-y-1">
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
                      <h3 className="text-[#0B101E] font-bold text-base md:text-lg">Return Policy & Terms</h3>
                      <p className="text-[#4F5A69] text-sm mt-1">Tap to view exchange process and conditions</p>
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
                    <div className="space-y-3 border-t border-[#D4AF37]/20 pt-4 text-sm text-[#4F5A69]">
                      <p className="font-semibold text-[#0B101E]">Returns and exchanges are accepted within 7 days with valid purchase proof.</p>

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