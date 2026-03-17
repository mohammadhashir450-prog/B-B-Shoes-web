'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Package, Clock, CheckCircle, XCircle, Eye, MapPin, Calendar, Loader2 } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  total: number;
  paymentMethod: string;
  shippingAddress?: string;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  processing: { label: 'Processing', icon: Package, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  shipped: { label: 'Shipped', icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
};

const mapApiOrderToUi = (order: any): Order => ({
  id: String(order.orderId || order.id),
  date: String(order.date || order.createdAt || new Date().toISOString()),
  status: (order.status || 'pending') as Order['status'],
  items: (order.items || []).map((item: any) => ({
    id: String(item.productId || item.id || ''),
    name: String(item.productName || item.name || 'Product'),
    price: Number(item.price || 0),
    image: String(item.productImage || item.image || ''),
    quantity: Number(item.quantity || 1),
    size: item.size ? String(item.size) : undefined,
    color: item.color ? String(item.color) : undefined,
  })),
  total: Number(order.total || 0),
  paymentMethod: String(order.paymentMethod || 'cod'),
  shippingAddress: order.customerAddress || order.shippingAddress,
});

function MyOrdersContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: bagItems } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState<'bag' | 'orders'>('bag');
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const placedOrderId = searchParams.get('placed');
    if (placedOrderId) {
      setSelectedTab('orders');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.user_id) {
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        setOrdersError(null);

        const response = await fetch(`/api/orders?user_id=${encodeURIComponent(session.user.user_id)}`, {
          cache: 'no-store',
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result?.message || 'Failed to load orders');
        }

        const apiOrders = (result?.data?.orders || []).map(mapApiOrderToUi);
        setOrders(apiOrders);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load orders';
        setOrdersError(message);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [session?.user?.user_id, status, searchParams]);

  // Loading state
  if (status === 'loading') {
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

  return (
    <div className="min-h-screen bg-[#0B101E] text-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Orders</h1>
            <p className="text-gray-400">Track your orders and shopping bag</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/10">
            <button
              onClick={() => setSelectedTab('bag')}
              className={`pb-4 px-6 font-semibold transition-all relative ${
                selectedTab === 'bag'
                  ? 'text-[#D4AF37]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Shopping Bag ({bagItems.length})
              {selectedTab === 'bag' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedTab('orders')}
              className={`pb-4 px-6 font-semibold transition-all relative ${
                selectedTab === 'orders'
                  ? 'text-[#D4AF37]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Order History ({orders.length})
              {selectedTab === 'orders' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"></div>
              )}
            </button>
          </div>

          {/* Shopping Bag Tab */}
          {selectedTab === 'bag' && (
            <div>
              {bagItems.length === 0 ? (
                <div className="bg-[#1A2435] rounded-3xl p-16 text-center border border-white/10">
                  <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
                  <p className="text-gray-400 mb-8">Add items to your bag and they&apos;ll appear here</p>
                  <Link
                    href="/new-arrivals"
                    className="inline-block bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-3 px-8 rounded-full transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {bagItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#1A2435] rounded-xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/30 transition-all"
                      >
                        <div className="aspect-square bg-black/20 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-1">{item.name}</h3>
                          <p className="text-xs text-gray-400 uppercase mb-2">{item.category}</p>
                          {item.size && (
                            <p className="text-sm text-gray-300">Size: {item.size}</p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                            <p className="text-xl font-bold text-[#D4AF37]">
                              PKR {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-[#1A2435] to-[#0F1825] rounded-2xl p-8 border border-[#D4AF37]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 mb-2">Total Amount</p>
                        <p className="text-3xl font-bold text-[#D4AF37]">
                          PKR {bagItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        href="/bag"
                        className="bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-3 px-8 rounded-full transition-all"
                      >
                        View Bag
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {selectedTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div className="bg-[#1A2435] rounded-3xl p-16 text-center border border-white/10">
                  <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading your orders...</p>
                </div>
              ) : ordersError ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
                  <p className="text-red-300 text-sm">{ordersError}</p>
                </div>
              ) : null}

              {orders.length === 0 ? (
                <div className="bg-[#1A2435] rounded-3xl p-16 text-center border border-white/10">
                  <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-[#D4AF37]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
                  <p className="text-gray-400 mb-8">Your order history will appear here once you place an order</p>
                  <Link
                    href="/new-arrivals"
                    className="inline-block bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-3 px-8 rounded-full transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const status = statusConfig[order.status] || statusConfig.pending;
                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={order.id}
                        className="bg-[#1A2435] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/30 transition-all"
                      >
                        {/* Order Header */}
                        <div className="p-6 border-b border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Order #{order.id}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.date).toLocaleDateString('en-PK', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                            <div className={`${status.bg} ${status.color} px-4 py-2 rounded-full flex items-center gap-2`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-sm font-semibold">{status.label}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                              <p className="font-semibold">{order.paymentMethod}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                              <p className="text-2xl font-bold text-[#D4AF37]">
                                PKR {order.total.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6">
                          <div className="grid gap-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-20 bg-black/20 rounded-lg overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">{item.name}</h4>
                                  <div className="flex items-center gap-4 text-sm text-gray-400">
                                    {item.size && <span>Size: {item.size}</span>}
                                    <span>Qty: {item.quantity}</span>
                                    <span className="text-[#D4AF37] font-semibold">
                                      PKR {item.price.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.shippingAddress && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="flex items-start gap-2 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <div>
                                  <p className="font-semibold text-white mb-1">Shipping Address</p>
                                  <p>{order.shippingAddress}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <MyOrdersContent />
    </Suspense>
  );
}