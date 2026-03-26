'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

export default function BagPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B101E] text-white">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session?.user) return null;

  const formattedTotal = `PKR ${totalPrice.toLocaleString()}`;
  const deliveryFee = totalPrice >= 4000 ? 0 : totalPrice > 0 ? 250 : 0;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="min-h-screen bg-[#0B101E] text-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shopping Bag</h1>
            <p className="text-gray-400">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag</p>
          </div>

          {items.length === 0 ? (
            // Empty Bag
            <div className="bg-[#1A2435] rounded-3xl p-16 text-center border border-white/10">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
              <p className="text-gray-400 mb-8">Start shopping to add items to your bag</p>
              <Link
                href="/sales"
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-3 px-8 rounded-full transition-all"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1A2435] rounded-xl p-6 border border-white/10 hover:border-[#D4AF37]/30 transition-all"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-32 h-32 bg-black/30 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {item.color && (
                          <p className="text-sm text-gray-300 mb-1">Color: {item.color}</p>
                        )}
                        {item.size && (
                          <p className="text-sm text-gray-300 mb-3">Size: {item.size}</p>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-black/30 rounded-lg p-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="text-2xl font-bold text-[#D4AF37]">
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-2xl p-8 border border-[#D4AF37]/20 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formattedTotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300">
                      <span>Delivery</span>
                      <span className="font-semibold text-[#D4AF37]">
                        {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-[#D4AF37]">PKR {finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 mb-4"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/sales"
                    className="w-full border border-white/20 hover:border-[#D4AF37] text-white font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    Continue Shopping
                  </Link>

                  {/* Features */}
                  <div className="mt-8 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                      <span>Free delivery on orders above PKR 4,000</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                      <span>7-day return policy</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                      <span>Secure payment options</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
