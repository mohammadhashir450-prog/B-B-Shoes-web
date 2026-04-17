'use client'

import Link from 'next/link'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

type WhatsAppContactCardProps = {
  title: string
  description: string
  message: string
  numberDisplay?: string
  buttonLabel?: string
  className?: string
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
    <path d="M16.6 13.8c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.6.1-.2.2-.7.7-.9.9-.2.2-.3.2-.6.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.7-.1-.3 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4.1-.1 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.3.1.1 1.6 2.4 3.8 3.4.5.2.9.4 1.2.5.5.2.9.2 1.2.1.4-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.2-.3-.3-.5-.4z" />
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20z" />
  </svg>
)

export default function WhatsAppContactCard({
  title,
  description,
  message,
  numberDisplay = '03068846624',
  buttonLabel = 'Chat on WhatsApp',
  className = '',
}: WhatsAppContactCardProps) {
  const href = buildWhatsAppUrl('923068846624', message)

  return (
    <div className={`rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-[#0B101E] p-6 shadow-[0_12px_28px_-18px_rgba(16,185,129,0.35)] ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(37,211,102,0.25)]">
          <WhatsAppIcon />
        </div>

        <div className="flex-1">
          <p className="text-emerald-300 text-[10px] uppercase tracking-[0.22em] font-bold mb-2">WhatsApp Support</p>
          <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
          <p className="text-white/70 text-sm leading-relaxed mb-4">{description}</p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              {numberDisplay}
            </span>
            <Link
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1fb857]"
            >
              <WhatsAppIcon />
              {buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}