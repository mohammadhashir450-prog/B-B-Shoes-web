import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Spotlight() {
  return (
    <section className="bb-spotlight relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[48%] h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/[0.14] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 text-center sm:px-8">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.5em] text-[#e2bd52]">Signature</p>
        <h2 className="!text-[#f8f2e4] text-[2.8rem] font-bold leading-[1] tracking-[-0.03em] sm:text-6xl md:text-7xl">
          The <span className="bb-gold-text italic">Formal</span> Edit.
        </h2>

        <div className="relative mx-auto mt-10 w-full max-w-[600px]">
          <div className="absolute inset-[1%] rounded-full border-2 border-[#f3dc92]/70 bg-[radial-gradient(circle,#f6ebcf_0%,#e6d09a_55%,#b8923c_100%)] shadow-[0_0_90px_rgba(212,175,55,0.35),inset_0_0_50px_rgba(255,244,214,0.5)]" />
          <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
            <Image
              src="/images/image.png"
              alt="Hand-finished tan leather double monk strap shoes"
              fill
              sizes="(max-width: 768px) 92vw, 600px"
              quality={95}
              className="scale-[1.02] object-contain mix-blend-multiply drop-shadow-[0_40px_30px_rgba(60,38,6,0.45)] [mask-image:radial-gradient(closest-side,#000_80%,transparent_97%)] [filter:contrast(1.08)_brightness(1.02)_saturate(1.08)]"
            />
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/formal"
            className="bb-hero-cta group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-10 py-4 text-[12px] font-extrabold uppercase tracking-[0.2em] !text-[#0b0c10]"
          >
            <span className="relative">Shop Formal</span>
            <ArrowRight size={15} className="relative transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
