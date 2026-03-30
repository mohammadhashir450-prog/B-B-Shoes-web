'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlist();
  const { allProducts, loading } = useProducts();
  const { addToCart } = useCart();

  const wishlistProducts = allProducts.filter((product) => wishlistIds.includes(product.id));

  return (
    <div className="min-h-screen bg-[#0B101E] text-white">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-3">Personal Shelf</p>
              <h1 className="text-4xl md:text-5xl font-serif font-black">My Wishlist</h1>
              <p className="text-white/55 mt-3 text-sm">Your liked products saved for quick access.</p>
            </div>

            {wishlistProducts.length > 0 ? (
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors text-[11px] uppercase tracking-[0.14em] font-bold"
              >
                <Trash2 size={14} />
                Clear Wishlist
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="py-28 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No liked products yet</h2>
              <p className="text-white/55 text-sm mb-7">Tap heart icons on products and they will appear here.</p>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#D4AF37] text-[#0B101E] text-[11px] uppercase tracking-[0.14em] font-black hover:bg-[#E5BF60] transition-colors"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-3xl overflow-hidden border border-white/10 bg-[#121A2F]/60 hover:border-[#D4AF37]/40 transition-all"
                >
                  <Link href={`/product/${product.id}`} className="block relative aspect-square bg-[#0B101E] p-6">
                    <Image
                      src={product.image || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      unoptimized={Boolean(product.image?.includes('cloudinary'))}
                    />
                  </Link>

                  <div className="p-5">
                    <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.16em] mb-2">{product.category}</p>
                    <h3 className="text-white font-semibold text-lg leading-tight min-h-[52px]">{product.name}</h3>
                    <p className="text-[#D4AF37] text-xl font-bold mt-3">PKR {Number(product.price).toLocaleString()}</p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart({
                            id: `${product.id}-wishlist`,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            size: product.sizes?.[0]?.toString() || 'Default',
                            color: product.colors?.[0]?.toString() || 'Default',
                            category: product.category,
                          });
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] text-[#0B101E] text-[10px] tracking-[0.12em] uppercase font-black py-2.5 hover:bg-[#E5BF60] transition-colors"
                      >
                        <ShoppingBag size={13} />
                        Add Bag
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 text-white/80 text-[10px] tracking-[0.12em] uppercase font-bold py-2.5 hover:text-white hover:border-white/40 transition-colors"
                      >
                        <Heart size={13} className="fill-white" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}