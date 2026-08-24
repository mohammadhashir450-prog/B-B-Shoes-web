'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 'female-1',
    tag: 'WOMEN',
    label: 'Her Collection',
    headline: ['Walk With', 'Confidence'],
    sub: 'Elegant designs crafted for the modern woman — from casual days to statement evenings.',
    cta: { label: 'Explore Women', href: '/women' },
    accent: '#C9A227',
    accentRgb: '201,162,39',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?auto=format&fit=crop&w=900&q=90',
        alt: 'Female model wearing stylish heels',
      },
      {
        src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=90',
        alt: 'Female model in casual sneakers',
      },
    ],
  },
  {
    id: 'female-2',
    tag: 'LADIES',
    label: 'Her Lifestyle',
    headline: ['Comfort', 'Meets Style'],
    sub: 'Every step tells a story — discover sandals, sneakers and formal heels for every occasion.',
    cta: { label: 'Shop Ladies', href: '/women' },
    accent: '#D4AF37',
    accentRgb: '212,175,55',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=900&q=90',
        alt: 'Elegant female shoe lifestyle',
      },
      {
        src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=90',
        alt: 'Female model wearing flats',
      },
    ],
  },
  {
    id: 'male-1',
    tag: 'MEN',
    label: 'His Collection',
    headline: ['Defined By', 'Every Step'],
    sub: 'Premium footwear for the man who sets the standard — formal, casual and athletic done right.',
    cta: { label: 'Explore Men', href: '/men' },
    accent: '#C9A227',
    accentRgb: '201,162,39',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=90',
        alt: 'Male model in premium sneakers',
      },
      {
        src: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=90',
        alt: 'Male model in formal shoes',
      },
    ],
  },
  {
    id: 'male-2',
    tag: 'GENTS',
    label: 'His Lifestyle',
    headline: ['Built For', 'The Bold'],
    sub: "From boardrooms to streets — our men's range delivers unmatched quality and lasting style.",
    cta: { label: 'Shop Men', href: '/men' },
    accent: '#D4AF37',
    accentRgb: '212,175,55',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=90',
        alt: 'Athletic male shoes close-up',
      },
      {
        src: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=90',
        alt: 'Male model in white sneakers',
      },
    ],
  },
];

const AUTO_MS = 6000;

// ─── Collage layout ───────────────────────────────────────────────────────────
function CollageImages({
  images,
  accent,
  accentRgb,
}: {
  images: (typeof SLIDES)[0]['images'];
  accent: string;
  accentRgb: string;
}) {
  return (
    <div className="relative w-full h-full select-none">
      {/* Back image — left, taller */}
      <div className="absolute left-0 top-0 w-[56%] h-[90%] rounded-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.7)]" style={{ zIndex: 1 }}>
        <Image src={images[0].src} alt={images[0].alt} fill className="object-cover object-top" sizes="350px" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
        {/* Subtle grain overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '150px' }} />
      </div>

      {/* Front image — right, shorter, offset down */}
      <div
        className="absolute right-0 bottom-0 w-[50%] h-[80%] rounded-2xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
        style={{ zIndex: 3, boxShadow: `0 0 0 1.5px ${accent}50, 0 40px 100px -20px rgba(0,0,0,0.8)` }}
      >
        <Image src={images[1].src} alt={images[1].alt} fill className="object-cover object-top" sizes="300px" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Glow blob between images */}
      <div
        className="absolute pointer-events-none rounded-full blur-[80px] opacity-25"
        style={{ background: accent, width: '45%', height: '50%', bottom: '8%', left: '28%', zIndex: 2 }}
      />

      {/* Number label on front image */}
      <div
        className="absolute bottom-4 right-4 z-10 text-[11px] font-black tracking-[0.25em] uppercase px-2.5 py-1 rounded-full backdrop-blur-md"
        style={{ background: `rgba(${accentRgb},0.15)`, color: accent, border: `1px solid rgba(${accentRgb},0.35)`, zIndex: 4 }}
      >
        B&amp;B
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ModelSlider() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slide = SLIDES[active];

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setActive((idx + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const next = useCallback(() => goTo(active + 1, 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo]);

  // Auto-advance + progress bar
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    setProgress(0);

    const tick = 50; // ms
    const steps = AUTO_MS / tick;
    let step = 0;

    progressRef.current = setInterval(() => {
      step++;
      setProgress((step / steps) * 100);
    }, tick);

    timerRef.current = setTimeout(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % SLIDES.length);
      setProgress(0);
    }, AUTO_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [active, isPaused, shouldReduceMotion]);

  // Variants
  const txtV = {
    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 30 : -30, filter: 'blur(4px)' }),
    show:  { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit:  (d: number) => ({ opacity: 0, y: d > 0 ? -20 : 20, filter: 'blur(2px)' }),
  };
  const imgV = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.95 }),
    show:  { opacity: 1, x: 0, scale: 1 },
    exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50, scale: 0.97 }),
  };
  const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] };

  return (
    <section
      className="relative bg-[#060A12] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Full-bleed ambient glow ── */}
      <AnimatePresence>
        <motion.div
          key={`glow-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 65% 60% at 80% 45%, rgba(${slide.accentRgb},0.14) 0%, transparent 70%),
                         radial-gradient(ellipse 40% 40% at 10% 80%, rgba(${slide.accentRgb},0.06) 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* ── Subtle grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* ── Top gold line ── */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg,transparent,${slide.accent}80,transparent)` }} />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-20 items-center min-h-[540px] md:min-h-[620px]">

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
                transition={transition}
                className="flex flex-col gap-6"
              >
                {/* Tag pill */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] tracking-[0.3em] font-black uppercase px-4 py-1.5 rounded-full"
                    style={{
                      color: slide.accent,
                      background: `rgba(${slide.accentRgb},0.12)`,
                      border: `1px solid rgba(${slide.accentRgb},0.3)`,
                    }}
                  >
                    {slide.tag}
                  </span>
                  <span className="h-px flex-1 max-w-[40px]" style={{ background: `linear-gradient(90deg,${slide.accent}60,transparent)` }} />
                  <span className="text-[10px] text-gray-600 tracking-widest font-medium">{slide.label}</span>
                </div>

                {/* Headline */}
                <div>
                  {slide.headline.map((line, i) => (
                    <h2
                      key={i}
                      className="block font-black leading-[0.95] tracking-tight text-white"
                      style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
                    >
                      {i === slide.headline.length - 1 ? (
                        <span style={{ color: slide.accent }}>{line}</span>
                      ) : line}
                    </h2>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <span className="w-8 h-[2px] rounded-full" style={{ background: slide.accent }} />
                  <span className="w-2 h-[2px] rounded-full bg-white/20" />
                </div>

                {/* Sub */}
                <p className="text-gray-400 leading-relaxed max-w-[400px]" style={{ fontSize: 'clamp(0.875rem, 1.4vw, 1rem)' }}>
                  {slide.sub}
                </p>

                {/* CTA row */}
                <div className="flex items-center gap-4 pt-1">
                  <Link
                    href={slide.cta.href}
                    className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-black tracking-wide overflow-hidden transition-all duration-300"
                    style={{ background: slide.accent, color: '#060A12' }}
                  >
                    {/* Shimmer */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                    <span className="relative z-10">{slide.cta.label}</span>
                    <ArrowRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/collections"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-white transition-colors duration-200"
                  >
                    All Collections
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Slide indicators */}
                <div className="flex items-center gap-3 pt-4">
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => goTo(i, i > active ? 1 : -1)}
                      aria-label={`Slide ${i + 1}`}
                      className="relative flex items-center"
                    >
                      {i === active ? (
                        /* Active — progress bar */
                        <span className="relative block h-[3px] w-12 rounded-full overflow-hidden bg-white/10">
                          <motion.span
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ background: slide.accent, width: `${progress}%` }}
                          />
                        </span>
                      ) : (
                        <span
                          className="block h-[2px] w-5 rounded-full transition-all duration-300 hover:opacity-60"
                          style={{ background: 'rgba(255,255,255,0.2)' }}
                        />
                      )}
                    </button>
                  ))}
                  <span className="ml-1 text-[11px] font-bold text-gray-600 tabular-nums">
                    {String(active + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(SLIDES.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ════════════ RIGHT — Images ════════════ */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[300px] sm:h-[420px] md:h-[560px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id + '-img'}
                  custom={direction}
                  variants={imgV}
                  initial="enter"
                  animate="show"
                  exit="exit"
                  transition={{ ...transition, duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <CollageImages images={slide.images} accent={slide.accent} accentRgb={slide.accentRgb} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prev / Next */}
            <div className="absolute -bottom-2 right-0 flex items-center gap-2 z-20">
              <button
                onClick={prev}
                aria-label="Previous"
                className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all backdrop-blur-sm hover:border-white/20"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="w-11 h-11 rounded-full text-[#060A12] flex items-center justify-center transition-all font-bold shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95"
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

      {/* ── Bottom gold line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg,transparent,${slide.accent}40,transparent)` }} />
    </section>
  );
}
