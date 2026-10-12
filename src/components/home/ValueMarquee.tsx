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
    <div className="bb-marquee relative overflow-hidden border-y border-[#ece4d3] bg-[#121821] py-4" aria-hidden>
      <div className="bb-marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {row.slice(0, ITEMS.length).map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center whitespace-nowrap">
                <span className="px-8 text-[11px] font-bold uppercase tracking-[0.28em] !text-[#f3dc92] md:text-xs">
                  {item}
                </span>
                <span className="text-[#d4af37]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
