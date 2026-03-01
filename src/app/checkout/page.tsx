'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CreditCard, Smartphone, Banknote, Check, ChevronRight, Shield } from 'lucide-react';

const paymentMethods = [
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: CreditCard,
    description: 'Transfer to our bank account',
    banks: [
      { name: 'HBL', account: '1234567890', title: 'B&B Shoes' },
      { name: 'Meezan Bank', account: '0987654321', title: 'B&B Shoes' },
      { name: 'Allied Bank', account: '1122334455', title: 'B&B Shoes' },
      { name: 'UBL', account: '5544332211', title: 'B&B Shoes' },
    ]
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    icon: Smartphone,
    description: 'Pay via JazzCash wallet',
    details: {
      number: '03XX-XXXXXXX',
      name: 'B&B Shoes'
    }
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: Banknote,
    description: 'Pay when you receive',
    note: 'Available for orders in all major cities'
  }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string>('cod');
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePlaceOrder = () => {
    // Simulate order placement
    setShowSuccess(true);
    setTimeout(() => {
      clearCart();
      router.push('/my-orders');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B101E] text-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Method</h1>
            <p className="text-gray-400">Choose your preferred payment option</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`bg-[#1A2435] rounded-xl p-6 border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#D4AF37]' : 'bg-white/5'
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-black' : 'text-white'}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold">{method.name}</h3>
                          {isSelected && (
                            <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{method.description}</p>

                        {/* Bank Details */}
                        {method.id === 'bank' && isSelected && method.banks && (
                          <div className="bg-black/30 rounded-lg p-4 space-y-3">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Available Banks:</p>
                            {method.banks.map((bank) => (
                              <div key={bank.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                <div>
                                  <p className="font-semibold">{bank.name}</p>
                                  <p className="text-xs text-gray-400">{bank.title}</p>
                                </div>
                                <p className="text-[#D4AF37] font-mono text-sm">{bank.account}</p>
                              </div>
                            ))}
                            <p className="text-xs text-yellow-400 mt-3">📌 Please send screenshot of payment receipt to confirm order</p>
                          </div>
                        )}

                        {/* JazzCash Details */}
                        {method.id === 'jazzcash' && isSelected && method.details && (
                          <div className="bg-black/30 rounded-lg p-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">JazzCash Number:</p>
                            <p className="text-2xl font-bold text-[#D4AF37] mb-2">{method.details.number}</p>
                            <p className="text-sm text-gray-400">Account Title: {method.details.name}</p>
                            <p className="text-xs text-yellow-400 mt-3">📌 Send payment and share transaction ID</p>
                          </div>
                        )}

                        {/* COD Note */}
                        {method.id === 'cod' && isSelected && method.note && (
                          <div className="bg-black/30 rounded-lg p-4">
                            <p className="text-sm text-gray-400">{method.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Security Notice */}
              <div className="bg-gradient-to-r from-[#1A2435] to-[#0F1825] rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Secure Payment</h3>
                    <p className="text-sm text-gray-400">All transactions are secure and encrypted. Your payment information is protected.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#1A2435] to-[#0F1825] rounded-2xl p-8 border border-[#D4AF37]/20 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-black/30 rounded-lg overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-gray-400">+{items.length - 3} more items</p>
                  )}
                </div>

                <div className="space-y-4 mb-6 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-semibold">PKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Delivery</span>
                    <span className="font-semibold text-[#D4AF37]">FREE</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">PKR {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={items.length === 0}
                  className="w-full bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Order
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1A2435] rounded-2xl p-8 max-w-md mx-4 border border-[#D4AF37]/30">
            <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Order Placed!</h2>
            <p className="text-gray-400 text-center">Your order has been successfully placed. Redirecting to orders...</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
