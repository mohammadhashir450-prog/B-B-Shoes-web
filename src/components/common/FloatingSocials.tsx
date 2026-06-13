'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Instagram } from 'lucide-react'

export default function FloatingSocials() {
  const [hovered, setHovered] = useState<'whatsapp' | 'instagram' | null>(null)

  const socials = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram size={22} className="text-[#18202B]" />,
      color: 'bg-gradient-to-tr from-[#D4AF37] via-[#F4CE5C] to-[#E5C04F]',
      href: 'https://www.instagram.com/bandbshoes_pk/',
      tooltip: 'Follow us on Instagram',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#18202B]" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.638 2.012 14.192 1 11.95 1 6.516 1 2.09 5.371 2.086 10.799c-.001 1.742.469 3.44 1.364 4.965l-.946 3.454 3.543-.93zm11.724-6.657c-.31-.156-1.834-.905-2.119-1.008-.285-.104-.493-.156-.701.156-.207.312-.804 1.008-.985 1.217-.18.21-.362.234-.672.079-.31-.156-1.31-.483-2.496-1.542-.924-.824-1.548-1.841-1.73-2.152-.18-.312-.019-.48.136-.635.139-.14.31-.363.466-.545.155-.182.207-.312.31-.52.104-.208.052-.39-.026-.546-.078-.156-.701-1.688-.96-2.311-.252-.607-.508-.523-.701-.533l-.598-.012c-.207 0-.546.078-.83.39-.285.31-1.092 1.066-1.092 2.6 0 1.533 1.117 3.014 1.272 3.223.156.208 2.197 3.355 5.323 4.704.744.321 1.323.512 1.774.655.748.238 1.43.204 1.969.124.6-.09 1.834-.751 2.09-1.477.257-.728.257-1.35.18-1.477-.077-.127-.285-.208-.596-.363z" />
        </svg>
      ),
      color: 'bg-[#25D366] hover:bg-[#20ba59]',
      href: 'https://wa.me/923068846624?text=Hi%20B%26B%20Shoes,%20I%20have%20an%20inquiry.',
      tooltip: 'Chat on WhatsApp',
    },
  ]

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3.5">
      {socials.map((social, index) => (
        <div key={social.id} className="relative flex items-center justify-end">
          {/* Tooltip */}
          <AnimatePresence>
            {hovered === social.id && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-14 bg-[#18202B] text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] tracking-widest font-bold py-2 px-3 rounded-lg shadow-xl whitespace-nowrap uppercase"
              >
                {social.tooltip}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Button */}
          <motion.a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(social.id as any)}
            onMouseLeave={() => setHovered(null)}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: index * 0.1,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-all duration-300 border border-white/10 ${social.color}`}
            aria-label={social.name}
          >
            {social.icon}
          </motion.a>
        </div>
      ))}
    </div>
  )
}
