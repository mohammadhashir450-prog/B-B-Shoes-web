'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck, Package } from 'lucide-react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReviewProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  brand: string;
  price: number;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  product: ReviewProduct | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const px = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${px} ${s <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-white/10 text-white/20'}`}
        />
      ))}
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

const AVATAR_COLORS = [
  ['#D4AF37', '#0B101E'],
  ['#6366F1', '#FFF'],
  ['#10B981', '#FFF'],
  ['#F43F5E', '#FFF'],
  ['#8B5CF6', '#FFF'],
  ['#F59E0B', '#0B101E'],
  ['#3B82F6', '#FFF'],
  ['#EC4899', '#FFF'],
];

function avatarColor(name: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] as [string, string];
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function ReviewSkeleton() {
  return (
    <div className="min-w-full px-4 sm:px-0">
      <div className="bg-white/5 rounded-2xl p-7 animate-pulse space-y-4 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-2.5 w-16 rounded bg-white/10" />
          </div>
        </div>
        <div className="h-2.5 w-20 rounded bg-white/10" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-4/5 rounded bg-white/10" />
        </div>
        <div className="flex gap-3 pt-2">
          <div className="w-14 h-14 rounded-xl bg-white/10" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-2.5 w-3/4 rounded bg-white/10" />
            <div className="h-2 w-1/2 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Single review card ───────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [bg, fg] = avatarColor(review.customerName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="
        relative bg-gradient-to-br from-[#1A2435] via-[#141D2C] to-[#0F1825]
        rounded-2xl p-6 sm:p-7 border border-white/10
        shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]
        flex flex-col h-full
      "
    >
      {/* Big decorative quote */}
      <Quote className="absolute top-5 right-6 w-10 h-10 text-[#D4AF37]/10 rotate-180" />

      {/* Header: avatar + name + date */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 select-none shadow-md"
          style={{ background: bg, color: fg }}
        >
          {initials(review.customerName)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm truncate leading-tight">
            {review.customerName}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">{formatDate(review.createdAt)}</p>
        </div>
        {review.isVerified && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full flex-shrink-0">
            <ShieldCheck className="w-3 h-3" /> Verified
          </span>
        )}
      </div>

      {/* Stars */}
      <StarRow rating={review.rating} />

      {/* Comment */}
      <p className="text-gray-300 text-sm leading-relaxed mt-3 mb-5 flex-1 line-clamp-4">
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Product card */}
      {review.product ? (
        <Link
          href={`/product/${review.product.id}`}
          className="
            group flex items-center gap-3 rounded-xl
            bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/30
            p-3 transition-all duration-200 mt-auto
          "
        >
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-black/30 flex-shrink-0 relative">
            <Image
              src={review.product.image}
              alt={review.product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="56px"
              onError={() => {}} // silent fallback
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate leading-snug group-hover:text-[#D4AF37] transition-colors">
              {review.product.name}
            </p>
            <p className="text-gray-500 text-[11px] mt-0.5 truncate">
              {review.product.brand} · {review.product.category}
            </p>
            <p className="text-[#D4AF37] text-xs font-bold mt-0.5">
              PKR {review.product.price.toLocaleString()}
            </p>
          </div>
          <Package className="w-4 h-4 text-gray-600 group-hover:text-[#D4AF37] flex-shrink-0 transition-colors" />
        </Link>
      ) : (
        <div className="mt-auto flex items-center gap-2 text-[11px] text-gray-600 border-t border-white/5 pt-3">
          <Package className="w-3.5 h-3.5" />
          <span>B&amp;B Shoes</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Auto-cycling dots ────────────────────────────────────────────────────────
function Dots({
  count,
  active,
  onDot,
}: {
  count: number;
  active: number;
  onDot: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDot(i)}
          aria-label={`Go to review ${i + 1}`}
          className={`
            rounded-full transition-all duration-300
            ${i === active ? 'w-6 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}
          `}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const VISIBLE_CARDS = { sm: 1, md: 2, lg: 3 }; // responsive visible count

export default function ReviewsSlider() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Responsive visible count ─────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisibleCount(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Fetch reviews ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/reviews?limit=20')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setReviews(json.data.reviews || []);
        else setError('Could not load reviews.');
      })
      .catch(() => setError('Could not load reviews.'))
      .finally(() => setLoading(false));
  }, []);

  // ── Max index ────────────────────────────────────────────────────────────
  const maxIndex = Math.max(0, reviews.length - visibleCount);

  // ── Auto-advance ─────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused || reviews.length <= visibleCount || shouldReduceMotion) return;
    timerRef.current = setInterval(advance, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance, isPaused, reviews.length, visibleCount, shouldReduceMotion]);

  const goTo = (i: number) => {
    setActiveIndex(Math.min(Math.max(0, i), maxIndex));
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 4000);
  };

  const prev = () => goTo(activeIndex > 0 ? activeIndex - 1 : maxIndex);
  const next = () => goTo(activeIndex < maxIndex ? activeIndex + 1 : 0);

  // ── Average rating ───────────────────────────────────────────────────────
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  // ── Visible slice ────────────────────────────────────────────────────────
  const visibleReviews = reviews.slice(activeIndex, activeIndex + visibleCount);

  // ── Empty / error states ─────────────────────────────────────────────────
  if (!loading && (error || reviews.length === 0)) return null;

  return (
    <section
      className="relative bg-[#0B101E] py-16 md:py-24 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decorative blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#6366F1]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#D4AF37]">
                Customer Reviews
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              What Our Customers
              <br />
              <span className="text-[#D4AF37]">Are Saying</span>
            </h2>
            {avgRating && (
              <div className="flex items-center gap-3 mt-3">
                <StarRow rating={Math.round(Number(avgRating))} size="lg" />
                <span className="text-2xl font-black text-white">{avgRating}</span>
                <span className="text-gray-500 text-sm">
                  / 5 · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Nav arrows */}
          {reviews.length > visibleCount && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={prev}
                aria-label="Previous reviews"
                className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-[#D4AF37] hover:border-[#D4AF37] text-white flex items-center justify-center transition-all duration-200 group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={next}
                aria-label="Next reviews"
                className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-[#D4AF37] hover:border-[#D4AF37] text-white flex items-center justify-center transition-all duration-200 group"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* ── Cards grid ── */}
        {loading ? (
          <div
            className={`grid gap-5 ${
              visibleCount === 1 ? 'grid-cols-1' : visibleCount === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {Array.from({ length: visibleCount }).map((_, i) => (
              <ReviewSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-5 ${
              visibleCount === 1 ? 'grid-cols-1' : visibleCount === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id + activeIndex} review={review} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ── Dots pagination ── */}
        {!loading && reviews.length > visibleCount && (
          <div className="mt-8">
            <Dots
              count={maxIndex + 1}
              active={activeIndex}
              onDot={goTo}
            />
          </div>
        )}

        {/* ── Review counter ribbon ── */}
        {!loading && reviews.length > 0 && (
          <p className="text-center text-xs text-gray-600 mt-6">
            Showing {Math.min(activeIndex + visibleCount, reviews.length)} of {reviews.length} reviews
          </p>
        )}
      </div>
    </section>
  );
}
