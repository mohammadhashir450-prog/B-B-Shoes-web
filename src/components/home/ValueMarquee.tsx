const ITEMS = [
  'Free Shipping Pakistan Wide',
  'Premium Quality Footwear',
  '7-Day Exchange Policy',
  '100% Authentic Products',
  'Cash on Delivery Available',
  'Trusted by 50K+ Customers',
]

export default function ValueMarquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="bb-marquee relative overflow-hidden bg-[linear-gradient(90deg,#b8860b,#e2bd52,#b8860b)] py-3.5" aria-hidden>
      <div className="bb-marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {row.slice(0, ITEMS.length).map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center whitespace-nowrap">
                <span className="px-8 text-[11px] font-bold uppercase tracking-[0.28em] !text-[#14110a] md:text-xs">
                  {item}
                </span>
                <span className="text-[#14110a]/60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
