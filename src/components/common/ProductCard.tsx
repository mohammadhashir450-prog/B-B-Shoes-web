'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Heart, Star } from 'lucide-react'
import HoverSwapImage from '@/components/common/HoverSwapImage'
import SaleBadge from '@/components/common/SaleBadge'
import { useWishlist } from '@/context/WishlistContext'
import type { Product } from '@/context/ProductContext'

type ProductCardProps = {
  product: Product
  index?: number
  /** 'rail' = fixed-width slide card, 'grid' = fills its grid cell */
  variant?: 'rail' | 'grid'
  priority?: boolean
}

export default function ProductCard({ product, index = 0, variant = 'grid', priority = false }: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const reduce = useReducedMotion()
  const wished = isWishlisted(product.id)

  const hasOriginal = !!product.originalPrice && product.originalPrice > product.price
  const percentOff = hasOriginal
    ? Math.round((((product.originalPrice as number) - product.price) / (product.originalPrice as number)) * 100)
    : 0
  const rating = Math.round(product.rating || 0)
  const soldOut = product.inStock === false

  const width = variant === 'rail' ? 'shrink-0 w-[78vw] max-w-[310px] sm:w-[300px] lg:w-[320px] snap-start' : 'w-full'

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: reduce ? 0.2 : 0.7, delay: reduce ? 0 : Math.min(index, 6) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`bb-card group relative ${width}`}
    >
      <Link
        href={`/product/${product.id}`}
        className="bb-card-body relative flex h-full flex-col overflow-hidden rounded-[22px] border border-[#ece4d3] bg-white"
      >
        {/* Media */}
        <div className="bb-card-media relative aspect-[4/4.4] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,#fffaf0_0%,#f4ecda_62%,#eadfc7_100%)]" />
          <div className="absolute left-1/2 top-[58%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/10 blur-2xl transition-all duration-700 group-hover:bg-[#d4af37]/25" />
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]">
            <HoverSwapImage
              primaryImage={product.image}
              secondaryImage={product.secondaryImage}
              alt={product.name}
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 45vw, 340px"
              fitClassName="object-contain object-center p-4 drop-shadow-[0_22px_22px_rgba(70,48,10,0.22)]"
              priority={priority}
              quality={90}
            />
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
            {product.isNewArrival && (
              <span className="rounded-full bg-[#121821] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] !text-white">
                New
              </span>
            )}
            {product.isOnSale && (
              <SaleBadge discount={product.discount || percentOff} saleType={product.saleType} size="xs" />
            )}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist(product.id)
            }}
            className={`absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 ${
              wished
                ? 'border-red-200 bg-white text-red-500 shadow-[0_8px_20px_-8px_rgba(239,68,68,0.6)]'
                : 'border-white/80 bg-white/80 text-[#566070] hover:text-red-500'
            }`}
          >
            <Heart size={17} strokeWidth={2} className={wished ? 'fill-red-500' : ''} />
          </button>

          {/* Hover CTA */}
          <div className="absolute inset-x-3 bottom-3 z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
            <span className="flex items-center justify-center gap-2 rounded-full bg-[#121821]/92 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] !text-white backdrop-blur">
              Quick View <ArrowUpRight size={14} />
            </span>
          </div>

          {soldOut && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/65 backdrop-blur-[2px]">
              <span className="rounded-full bg-[#121821] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] !text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.22em] text-[#a97a18]">
              {product.brand || product.category || 'B&B Exclusive'}
            </p>
            <span className="flex shrink-0 items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={11} className={s <= rating ? 'fill-[#d4af37] text-[#d4af37]' : 'fill-[#e6dfd0] text-[#e6dfd0]'} />
              ))}
            </span>
          </div>

          <h3 className="line-clamp-2 min-h-[2.7em] font-serif text-[17px] font-bold leading-snug !text-[#121821] transition-colors duration-300 group-hover:!text-[#a97a18]">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between border-t border-dashed border-[#e9dfc8] pt-3">
            <div>
              <p className="text-[19px] font-extrabold leading-none text-[#121821]">
                <span className="mr-1 text-[11px] font-bold text-[#a97a18]">PKR</span>
                {product.price.toLocaleString()}
              </p>
              {hasOriginal && (
                <p className="mt-1 flex items-center gap-2 text-xs text-[#7a8492]">
                  <span className="line-through">PKR {(product.originalPrice as number).toLocaleString()}</span>
                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">-{percentOff}%</span>
                </p>
              )}
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3d6b8] bg-[#fbf6ea] text-[#121821] transition-all duration-300 group-hover:border-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-white">
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
