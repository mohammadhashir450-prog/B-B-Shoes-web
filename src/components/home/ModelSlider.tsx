'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

// ─── Slide data ───────────────────────────────────────────────────────────────
// 2 female collage + 2 male collage
const SLIDES = [
  {
    id: 'female-1',
    gender: 'Her Collection',
    headline: 'Walk With Confidence',
    sub: 'Elegant designs crafted for the modern woman — from casual days to statement evenings.',
    cta: { label: 'Shop Women', href: '/women' },
    accent: '#D4AF37',
    // Two side-by-side female model images
    images: [
      {
        src: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?auto=format&fit=crop&w=900&q=85',
        alt: 'Female model wearing stylish heels',
      },
      {
        src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85',
        alt: 'Female model in casual sneakers',
      },
    ],
    tag: 'Women',
    badge: '✦ New Arrivals',
  },
  {
    id: 'female-2',
    gender: 'Her Lifestyle',
    headline: 'Comfort Meets Style',
    sub: 'Every step tells a story — discover sandals, sneakers and formal heels for every occasion.',
    cta: { label: 'Explore Women', href: '/women' },
    accent: '#E8A0BF',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=900&q=85',
        alt: 'Elegant female shoe detail',
      },
      {
        src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=85',
        alt: 'Female model wearing casual flats',
      },
    ],
    tag: 'Women',
    badge: '✦ Trending Now',
  },
  {
    id: 'male-1',
    gender: 'His Collection',
    headline: 'Defined By Every Step',
    sub: 'Premium footwear for the man who sets the standard — formal, casual & athletic done right.',
    cta: { label: 'Shop Men', href: '/men' },
    accent: '#94A3B8',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
        alt: 'Male model in premium sneakers',
      },
      {
        src: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=85',
        alt: 'Male model in formal shoes',
      },
    ],
    tag: 'Men',
    badge: '✦ Best Sellers',
  },
  {
    id: 'male-2',
    gender: 'His Lifestyle',
    headline: 'Built for the Bold',
    sub: 'From boardrooms to streets — our men\'s range delivers unmatched quality and lasting style.',
    cta: { label: 'Explore Men', href: '/men' },
    accent: '#6366F1',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=85',
        alt: 'Athletic male shoes close-up',
      },
      {
        src: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=85',
        alt: 'Male model in white sneakers',
      },
    ],
    tag: 'Men',
    badge: '✦ Premium Range',
  },
];

// ─── Progress bar for auto-advance ───────────────────────────────────────────
function ProgressBar({ active, duration }: { active: boolean; duration: number }) {
  return (
    <div className="h-0.5 bg-white/10 rounded-full overflow-hidden w-12">
      <motion.div
        className="h-full bg-[#D4AF37] rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: active ? '100%' : '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </div>
  );
}

// ─── Collage (two images side by side with offset) ───────────────────────────
function CollageImages({ images, accentColor }: { images: (typeof SLIDES)[0]['images']; accentColor: string }) {
  return (
    <div className="relative w-full h-full">
      {/* Left image — taller, slightly behind */}
      <div
        className="absolute left-0 top-0 w-[58%] h-[88%] rounded-2xl overflow-hidden shadow-2xl"
        style={{ zIndex: 1 }}
      >
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 50vw, 400px"
          priority
        />
        {/* Subtle dark overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Right image — shorter, in front, offset down */}
      <div
        className="absolute right-0 bottom-0 w-[52%] h-[82%] rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
        style={{ zIndex: 2 }}
      >
        <Image
          src={images[1].src}
          alt={images[1].alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 50vw, 350px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Accent blob behind images */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-16 blur-3xl rounded-full opacity-30 pointer-events-none"
        style={{ background: accentColor }}
      />

      {/* Gold border accent on front image */}
      <div
        className="absolute right-0 bottom-0 w-[52%] h-[82%] rounded-2xl pointer-events-none"
        style={{ boxShadow: `0 0 0 2px ${accentColor}40`, zIndex: 3 }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AUTO_DURATION = 5500;

export default function ModelSlider() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setActive((idx + SLIDES.length) % SLIDES.length);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const next = useCallback(() => goTo(active + 1, 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo]);

  // Auto-advance
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    timerRef.current = setTimeout(next, AUTO_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, isPaused, next, shouldReduceMotion]);

  const slide = SLIDES[active];

  // Text animation variants
  const textVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -30 }),
  };

  const imageVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d * -40, scale: 0.97 }),
  };

  return (
    <section
      className="relative bg-[#06080F] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow matching current slide accent */}
      <motion.div
        key={`bg-${slide.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 75% 50%, ${slide.accent}18 0%, transparent 70%)`,
        }}
      />

      {/* Subtle grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 md:gap-16 items-center min-h-[520px] md:min-h-[600px]">

          {/* ── LEFT: Text content ─────────────────────────────────────── */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id + '-text'}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                {/* Gender label + badge */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-[10px] tracking-[0.22em] uppercase font-bold px-3.5 py-1.5 rounded-full border"
                    style={{ color: slide.accent, borderColor: `${slide.accent}40`, background: `${slide.accent}12` }}
                  >
                    {slide.gender}
                  </span>
                  <span className="text-[10px] tracking-widest text-gray-500 font-medium">{slide.badge}</span>
                </div>

                {/* Headline */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
                  {slide.headline.split(' ').map((word, i) => (
                    <span key={i}>
                      {i === slide.headline.split(' ').length - 1 ? (
                        <span style={{ color: slide.accent }}>{word}</span>
                      ) : (
                        word
                      )}{' '}
                    </span>
                  ))}
                </h2>

                {/* Sub text */}
                <p className="text-gray-400 text-base leading-relaxed max-w-[420px]">
                  {slide.sub}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-4 pt-2">
                  <Link
                    href={slide.cta.href}
                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all duration-200"
                    style={{ background: slide.accent, color: '#06080F' }}
                  >
                    {slide.cta.label}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/collections"
                    className="text-sm font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    All Collections
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Slide counter */}
                <div className="flex items-center gap-3 pt-3">
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => goTo(i, i > active ? 1 : -1)}
                      aria-label={`Go to slide ${i + 1}`}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <span
                        className={`block rounded-full transition-all duration-300 ${
                          i === active ? 'w-8 h-1.5' : 'w-4 h-1 opacity-40 hover:opacity-70'
                        }`}
                        style={{ background: i === active ? slide.accent : '#fff' }}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-gray-600 ml-2 tabular-nums">
                    {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Collage images ──────────────────────────────────── */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[320px] sm:h-[420px] md:h-[540px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id + '-img'}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <CollageImages images={slide.images} accentColor={slide.accent} />
                </motion.div>
              </AnimatePresence>

              {/* Floating category pill */}
              <motion.div
                key={slide.id + '-pill'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-bold tracking-wider uppercase"
                style={{
                  background: `${slide.accent}20`,
                  borderColor: `${slide.accent}40`,
                  color: slide.accent,
                }}
              >
                <Sparkles className="w-3 h-3" />
                {slide.tag}
              </motion.div>
            </div>

            {/* Prev / Next arrows */}
            <div className="absolute -bottom-0 right-0 flex items-center gap-2 z-20">
              <button
                onClick={prev}
                aria-label="Previous"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="w-10 h-10 rounded-full text-[#06080F] flex items-center justify-center transition-all font-bold shadow-lg"
                style={{ background: slide.accent }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
