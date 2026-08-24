'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

// ─── Slide data with real product images ─────────────────────────────────────
// Layout: "main" is the large hero image; "accent" is the smaller offset card
const SLIDES = [
  {
    id: 'ladies-mule',
    tag: 'WOMEN',
    label: 'New Arrival',
    headline: ['Effortless', 'Elegance'],
    sub: 'Embellished crystal-strap mules — where luxury meets everyday sophistication.',
    cta: { label: 'Shop Women', href: '/women' },
    accent: '#C9A227',
    accentRgb: '201,162,39',
    bg: '#0A0806',
    main: { src: '/slides/shoe-1.jpg', alt: 'Black crystal-embellished ladies mule on marble' },
    secondary: { src: '/slides/shoe-2.jpg', alt: 'Black ladies mule styled with clutch and perfume' },
    objectPos: 'object-center',
  },
  {
    id: 'graceful-black',
    tag: 'MEN',
    label: 'Best Seller',
    headline: ['Bold Move,', 'Every Step'],
    sub: 'The Graceful series — engineered performance meets streetwear edge. Lightweight, striking, relentless.',
    cta: { label: 'Shop Men', href: '/men' },
    accent: '#8EC5FC',
    accentRgb: '142,197,252',
    bg: '#06090F',
    main: { src: '/slides/shoe-3.jpg', alt: 'Graceful black sneaker floating side view' },
    secondary: { src: '/slides/shoe-5.jpg', alt: 'Graceful black sneaker pair top view' },
    objectPos: 'object-center',
  },
  {
    id: 'beige-casual',
    tag: 'UNISEX',
    label: 'Trending Now',
    headline: ['Street Style,', 'Defined'],
    sub: 'WO.LYXFSOX casual runners — premium leather build with a clean silhouette for all-day comfort.',
    cta: { label: 'Explore Collection', href: '/collections' },
    accent: '#C9A227',
    accentRgb: '201,162,39',
    bg: '#080706',
    main: { src: '/slides/shoe-6.jpg', alt: 'Beige WO.LYXFSOX sneaker on concrete block' },
    secondary: { src: '/slides/shoe-7.jpg', alt: 'Beige WO.LYXFSOX sneaker on-foot lifestyle' },
    objectPos: 'object-center',
  },
  {
    id: 'rose-sandal',
    tag: 'WOMEN',
    label: 'Premium',
    headline: ['Dressed', 'To Dazzle'],
    sub: 'Embellished block-heel sandals — the centrepiece of every evening look. Pure B&B luxury.',
    cta: { label: 'Shop Ladies', href: '/women' },
    accent: '#F0B8A0',
    accentRgb: '240,184,160',
    bg: '#0A0808',
    main: { src: '/slides/shoe-8.jpg', alt: 'Rose gold block-heel sandal on marble counter' },
    secondary: { src: '/slides/shoe-1.jpg', alt: 'Black crystal mule product shot' },
    objectPos: 'object-center',
  },
];

const AUTO_MS = 6000;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ModelSlider() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slide = SLIDES[active];

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setActive((idx + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const next = useCallback(() => goTo(active + 1, 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo]);

  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    setProgress(0);
    const tick = 50;
    const steps = AUTO_MS / tick;
    let step = 0;
    progressRef.current = setInterval(() => {
      step++;
      setProgress(Math.min((step / steps) * 100, 100));
    }, tick);
    timerRef.current = setTimeout(() => {
      setDirection(1);
      setActive((p) => (p + 1) % SLIDES.length);
      setProgress(0);
    }, AUTO_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [active, isPaused, shouldReduceMotion]);

  // ── Variants ──────────────────────────────────────────────────────────────
  const txtV = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 32 : -32, filter: 'blur(6px)' }),
    show:  { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit:  (d: number) => ({ opacity: 0, y: d > 0 ? -20 : 20, filter: 'blur(2px)' }),
  };
  const mainImgV = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.96 }),
    show:  { opacity: 1, x: 0, scale: 1 },
    exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40, scale: 0.97 }),
  };
  const accentImgV = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.9, rotate: d > 0 ? 4 : -4 }),
    show:  { opacity: 1, x: 0, scale: 1, rotate: 0 },
    exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50, scale: 0.93 }),
  };
  const t = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] };

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: slide.bg }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Ambient bg glow ── */}
      <AnimatePresence>
        <motion.div
          key={`glow-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 55% at 75% 50%, rgba(${slide.accentRgb},0.12) 0%, transparent 70%),
                         radial-gradient(ellipse 35% 40% at 15% 75%, rgba(${slide.accentRgb},0.06) 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* ── Top gold line ── */}
      <motion.div
        key={`topline-${slide.id}`}
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${slide.accent}90, transparent)` }}
      />

      {/* ── Subtle dot-grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 py-14 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center min-h-[500px] md:min-h-[580px]">

          {/* ════════════ LEFT — Text ════════════ */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id + '-txt'}
                custom={direction}
                variants={txtV}
                initial="enter"
                animate="show"
                exit="exit"
                transition={t}
                className="flex flex-col gap-5"
              >
                {/* Eyebrow */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] tracking-[0.3em] font-black uppercase px-4 py-1.5 rounded-full"
                    style={{
                      color: slide.accent,
                      background: `rgba(${slide.accentRgb},0.12)`,
                      border: `1px solid rgba(${slide.accentRgb},0.28)`,
                    }}
                  >
                    {slide.tag}
                  </span>
                  <span className="h-px flex-1 max-w-[36px]" style={{ background: `linear-gradient(90deg,${slide.accent}70,transparent)` }} />
                  <span className="text-[10px] tracking-widest text-gray-500 font-semibold uppercase">{slide.label}</span>
                </div>

                {/* Headline */}
                <div className="space-y-1">
                  {slide.headline.map((line, i) => (
                    <h2
                      key={i}
                      className="block font-black leading-[0.95] tracking-tight"
                      style={{
                        fontSize: 'clamp(2.6rem, 5.5vw, 5rem)',
                        color: i === slide.headline.length - 1 ? slide.accent : '#fff',
                      }}
                    >
                      {line}
                    </h2>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-[2px] rounded-full" style={{ background: slide.accent }} />
                  <span className="w-2.5 h-[2px] rounded-full bg-white/15" />
                  <span className="w-1.5 h-[2px] rounded-full bg-white/8" />
                </div>

                {/* Body */}
                <p className="text-gray-400 leading-relaxed max-w-[380px]" style={{ fontSize: 'clamp(0.85rem, 1.3vw, 0.975rem)' }}>
                  {slide.sub}
                </p>

                {/* CTAs */}
                <div className="flex items-center gap-4 pt-1 flex-wrap">
                  <Link
                    href={slide.cta.href}
                    className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-black tracking-wide overflow-hidden"
                    style={{ background: slide.accent, color: slide.bg || '#06080F' }}
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                    <span className="relative z-10">{slide.cta.label}</span>
                    <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-white transition-colors"
                  >
                    View All <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Progress indicators */}
                <div className="flex items-center gap-3 pt-5">
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => goTo(i, i > active ? 1 : -1)}
                      aria-label={`Slide ${i + 1}`}
                    >
                      {i === active ? (
                        <span className="relative block h-[3px] w-10 rounded-full overflow-hidden bg-white/10">
                          <motion.span
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ background: slide.accent, width: `${progress}%` }}
                          />
                        </span>
                      ) : (
                        <span className="block h-[2px] w-4 rounded-full bg-white/20 hover:bg-white/40 transition-colors" />
                      )}
                    </button>
                  ))}
                  <span className="ml-1 text-[10px] font-bold text-gray-600 tabular-nums">
                    {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ════════════ RIGHT — Images ════════════ */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[320px] sm:h-[430px] md:h-[560px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id + '-imgs'}
                  custom={direction}
                  className="absolute inset-0"
                  initial="enter"
                  animate="show"
                  exit="exit"
                  transition={{ ...t, staggerChildren: 0.06 }}
                >
                  {/* ── Main large image ── */}
                  <motion.div
                    custom={direction}
                    variants={mainImgV}
                    transition={t}
                    className="absolute left-0 top-0 w-[65%] h-[92%] rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: `0 32px 80px -20px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)`,
                      zIndex: 1,
                    }}
                  >
                    <Image
                      src={slide.main.src}
                      alt={slide.main.alt}
                      fill
                      priority
                      sizes="(max-width: 768px) 60vw, 420px"
                      className={`object-cover ${slide.objectPos}`}
                    />
                    {/* Dark vignette at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    {/* Subtle brand watermark */}
                    <span
                      className="absolute bottom-3 left-3 text-[9px] font-black tracking-[0.3em] uppercase px-2 py-1 rounded-full backdrop-blur-md z-10"
                      style={{ background: `rgba(${slide.accentRgb},0.15)`, color: slide.accent, border: `1px solid rgba(${slide.accentRgb},0.3)` }}
                    >
                      B&amp;B
                    </span>
                  </motion.div>

                  {/* ── Accent secondary image ── */}
                  <motion.div
                    custom={direction}
                    variants={accentImgV}
                    transition={{ ...t, duration: 0.72 }}
                    className="absolute right-0 bottom-0 w-[48%] h-[74%] rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: `0 0 0 1.5px ${slide.accent}45, 0 40px 100px -20px rgba(0,0,0,0.8)`,
                      zIndex: 3,
                    }}
                  >
                    <Image
                      src={slide.secondary.src}
                      alt={slide.secondary.alt}
                      fill
                      sizes="(max-width: 768px) 45vw, 300px"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-black/40 via-transparent to-transparent" />
                  </motion.div>

                  {/* ── Glow between images ── */}
                  <div
                    className="absolute pointer-events-none rounded-full blur-[70px] opacity-20"
                    style={{
                      background: slide.accent,
                      width: '40%',
                      height: '45%',
                      bottom: '10%',
                      left: '30%',
                      zIndex: 2,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Prev / Next arrows ── */}
            <div className="absolute -bottom-1 right-0 flex items-center gap-2 z-20">
              <button
                onClick={prev}
                aria-label="Previous"
                className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/12 text-white flex items-center justify-center transition-all backdrop-blur-md"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="w-11 h-11 rounded-full text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ background: slide.accent }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${slide.accent}35, transparent)` }}
      />
    </section>
  );
}
