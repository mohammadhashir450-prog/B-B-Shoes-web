'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Youtube, ArrowUpRight, Mail } from 'lucide-react'

const footerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

export default function Footer() {
  return (
    <footer className="relative bg-[#0B101E] pt-24 md:pt-32 pb-8 overflow-hidden border-t border-white/5">
      
      {/* Ambient Floor Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-[#D4AF37]/5 blur-[150px] pointer-events-none rounded-full" />

      <motion.div 
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10"
      >
        
        {/* Top Section: Editorial Statement & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pb-20 border-b border-white/10">
          <motion.div variants={itemVariants} className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-serif font-black text-white leading-[1.1] mb-6">
              Step into <span className="text-transparent [-webkit-text-stroke:1px_rgba(212,175,55,0.6)]">Elegance.</span>
            </h2>
            <p className="text-white/50 text-sm md:text-base leading-relaxed font-light max-w-md">
              Join the Insider. Receive invitations to private viewings, early access to new collections, and bespoke styling advice.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full lg:w-auto min-w-[320px] md:min-w-[400px]">
            <div className="relative flex items-center p-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full focus-within:border-[#D4AF37]/50 focus-within:bg-white/10 transition-all duration-500">
              <Mail size={18} className="text-white/40 ml-4 mr-2" strokeWidth={1.5} />
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-transparent px-2 py-3 text-sm text-white placeholder-white/30 focus:outline-none"
              />
              <button className="px-6 py-3 bg-[#D4AF37] text-[#0B101E] text-[10px] font-black tracking-[0.2em] uppercase rounded-full hover:bg-white hover:scale-105 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        {/* Middle Section: Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-20">
          
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-4 pr-8">
            <Link href="/" className="mb-8 inline-block group">
              <div className="flex items-center gap-3 mb-2">
                <svg width="34" height="22" viewBox="0 0 52 36" fill="none" className="group-hover:scale-105 transition-transform duration-500">
                  <path d="M4 28 Q4 32 8 32 L44 32 Q48 32 48 28 L48 26 L4 26 Z" fill="#D4AF37"/>
                  <path d="M4 26 L4 16 Q4 10 10 8 L24 7 Q30 7 34 10 L48 26 Z" fill="#D4AF37"/>
                  <path d="M12 18 C16 15 22 15 26 17" stroke="#0B101E" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <span className="text-white text-2xl font-bold tracking-widest group-hover:text-[#D4AF37] transition-colors">B&B Shoes</span>
              </div>
              <p className="text-[#D4AF37]/60 text-[9px] tracking-[0.3em] uppercase font-bold">Brand You Like</p>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-[280px]">
              Elevating the standard of luxury footwear through centuries of craftsmanship and modern Italian design.
            </p>
            <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-[0.2em] font-semibold">
              <span>Multan</span>
              <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
              <span>EST. 2023</span>
            </div>
          </motion.div>

          {/* Links Column 1 */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-[#D4AF37] text-[10px] font-bold tracking-[0.25em] uppercase mb-8">
              Collections
            </h3>
            <ul className="space-y-4">
              {['The Heritage Series', 'Modern Minimalist', 'Limited Collaborations', 'Bespoke Services'].map((item) => (
                <li key={item}>
                  <Link href="#" className="group flex items-center text-white/60 hover:text-white transition-colors text-sm w-fit">
                    <span className="relative overflow-hidden pb-1">
                      {item}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37] transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Links Column 2 */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h3 className="text-[#D4AF37] text-[10px] font-bold tracking-[0.25em] uppercase mb-8">
              Client Care
            </h3>
            <ul className="space-y-4">
              {['Private Consultation', 'Shipping & Returns', 'Authenticity Check', 'Shoe Care Guide'].map((item) => (
                <li key={item}>
                  <Link href="#" className="group flex items-center text-white/60 hover:text-white transition-colors text-sm w-fit">
                    <span className="relative overflow-hidden pb-1">
                      {item}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37] transform scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Socials Column */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-[#D4AF37] text-[10px] font-bold tracking-[0.25em] uppercase mb-8">
              Social
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Instagram', icon: Instagram },
                { name: 'Facebook', icon: Facebook },
                { name: 'YouTube', icon: Youtube }
              ].map((social) => (
                <li key={social.name}>
                  <a href="#" className="group flex items-center gap-3 text-white/60 hover:text-[#D4AF37] transition-colors text-sm w-fit">
                    <social.icon size={16} strokeWidth={1.5} />
                    <span>{social.name}</span>
                    <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Bottom Section: Architectural Watermark & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center relative">
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-16 relative z-20">
            <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} B&B Luxury Footwear. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-white/30 text-[10px] tracking-[0.2em] uppercase">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Massive Background Text Watermark */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full overflow-hidden flex justify-center pointer-events-none select-none"
          >
            <h1 className="text-[20vw] font-serif font-black text-white/[0.02] leading-none tracking-tighter whitespace-nowrap mb-[-8vw]">
              B&B SHOES
            </h1>
          </motion.div>

        </div>
      </motion.div>
    </footer>
  )
}