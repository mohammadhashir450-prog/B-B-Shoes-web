'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';

// Dynamically import map component with SSR disabled to prevent browser window-related crashes on build
const TrackingMap = dynamic(() => import('@/components/order/TrackingMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] md:min-h-[450px] rounded-2xl bg-[#1A2435] border border-white/10 flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      <p className="text-gray-400 text-sm">Loading visual maps...</p>
    </div>
  ),
});

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface OrderDetails {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber?: string;
  createdAt: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', desc: 'Order received & pending verification' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Order approved & details verified' },
  { key: 'processing', label: 'Processing', desc: 'Packed & ready at B&B Sahiwal Hub' },
  { key: 'shipped', label: 'In Transit', desc: 'Dispatched via logistics carrier' },
  { key: 'delivered', label: 'Delivered', desc: 'Package received & signed' },
];

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/orders/${params.id}`);
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Unable to load order details');
        }

        setOrder(result.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  // Determine current progress step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return -1;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B101E] text-white">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
            <p className="text-gray-400">Fetching order tracking information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0B101E] text-white">
        <Navbar />
        <div className="pt-32 pb-16 max-w-xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Tracking Error</h2>
          <p className="text-gray-400 mb-8">{error || 'Order detail not found'}</p>
          <Link
            href="/my-orders"
            className="bg-[#D4AF37] hover:bg-[#F4CE5C] text-black font-bold py-3 px-8 rounded-full transition-all inline-block"
          >
            Back to My Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  // Calculate delivery date estimation (3-5 business days)
  const orderDate = new Date(order.createdAt);
  const minDeliveryDate = new Date(orderDate);
  minDeliveryDate.setDate(orderDate.getDate() + 3);
  const maxDeliveryDate = new Date(orderDate);
  maxDeliveryDate.setDate(orderDate.getDate() + 5);

  const formattedEstDate = `${minDeliveryDate.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })} - ${maxDeliveryDate.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  // Prefilled WhatsApp link
  const supportText = `Hi B&B Shoes Support, I am tracking my Order #${order.orderId || order.id}. Status is currently '${order.status}'. Please assist me.`;
  const whatsappUrl = `https://wa.me/923068846624?text=${encodeURIComponent(supportText)}`;

  return (
    <div className="min-h-screen bg-[#0B101E] text-white">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/my-orders" 
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
          </div>

          {/* Title & Banner Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A2435] rounded-3xl p-6 md:p-8 border border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#D4AF37]">
                  Track Order
                </h1>
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-gray-300 font-mono">
                  #{order.orderId}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            {!isCancelled ? (
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-4 md:text-right">
                <p className="text-xs text-gray-400 mb-1">Estimated Delivery</p>
                <p className="text-lg font-bold text-[#D4AF37]">{formattedEstDate}</p>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 font-bold text-center">
                🚫 Order Cancelled
              </div>
            )}
          </div>

          {/* Stepper Status Bar (Only if not cancelled) */}
          {!isCancelled && (
            <div className="mb-12 bg-[#1A2435] rounded-3xl p-6 md:p-8 border border-white/10">
              <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" /> Shipment Status Timeline
              </h2>
              
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
                {/* Horizontal line for desktop stepper */}
                <div className="absolute top-1/2 left-[5%] right-[5%] h-1 bg-white/10 -translate-y-1/2 hidden md:block z-0" />
                
                {/* Progress highlight line */}
                {currentStep > 0 && (
                  <div 
                    className="absolute top-1/2 left-[5%] h-1 bg-[#D4AF37] -translate-y-1/2 hidden md:block z-0 transition-all duration-500" 
                    style={{ width: `${(currentStep / 4) * 90}%` }}
                  />
                )}

                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  
                  return (
                    <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-2 w-full md:w-1/5 relative z-10">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone 
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-bold' 
                            : 'bg-[#1A2435] border-white/20 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-[#D4AF37]/30 scale-110' : ''}`}
                      >
                        {isDone && idx < currentStep ? (
                          <CheckCircle className="w-5 h-5 text-black" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      
                      <div className="text-left md:text-center">
                        <p className={`font-bold text-sm ${isDone ? 'text-white' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 md:max-w-[120px] md:mx-auto">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map & Detail Split View */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Live Tracking Map Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#1A2435] rounded-3xl p-6 border border-white/10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#D4AF37]" /> Live Tracking Map
                </h2>
                
                {/* Dynamically Loaded Map */}
                {!isCancelled ? (
                  <TrackingMap status={order.status} address={order.customerAddress} />
                ) : (
                  <div className="w-full h-full min-h-[350px] md:min-h-[450px] rounded-2xl bg-[#0e1422] border border-white/10 flex flex-col items-center justify-center p-6 text-center text-gray-400">
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
                    Tracking map disabled because this order has been cancelled.
                  </div>
                )}
                
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] block"></span> Warehouse</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span> Shipping Address</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 block"></span> Courier Van (Animates when In Transit)</div>
                </div>
              </div>
            </div>

            {/* Courier & Order Invoice Column */}
            <div className="space-y-6">
              
              {/* Courier Panel */}
              <div className="bg-[#1A2435] rounded-3xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-[#D4AF37] border-b border-white/10 pb-2">
                  Carrier Information
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Courier Logistics</span>
                    <span className="font-semibold">TCS Pakistan Express</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tracking Reference</span>
                    <span className="font-mono text-gray-200">
                      {order.trackingNumber || `TCS-${order.orderId.replace('ORD-', '')}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Status</span>
                    <span className="font-semibold capitalize text-sky-400">
                      {order.status === 'shipped' ? 'In Transit 🚚' : order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transit Route</span>
                    <span className="font-semibold text-gray-200">B&B Hub → {order.customerAddress.split(',').pop()?.trim()}</span>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-center text-sm shadow-md"
                    >
                      Chat with Support 💬
                    </a>
                  </div>
                </div>
              </div>

              {/* Order Invoice Details */}
              <div className="bg-[#1A2435] rounded-3xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-[#D4AF37] border-b border-white/10 pb-2">
                  Invoice Summary
                </h3>

                <div className="space-y-4">
                  {/* Items list */}
                  <div className="max-h-[180px] overflow-y-auto pr-1 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 text-xs">
                        <img 
                          src={item.productImage} 
                          alt={item.productName} 
                          className="w-12 h-12 rounded object-cover bg-black/20"
                        />
                        <div className="flex-1">
                          <p className="font-semibold line-clamp-1">{item.productName}</p>
                          <p className="text-gray-400 mt-0.5">Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-gray-300">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>PKR {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping Fee</span>
                      <span>PKR {order.shippingFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-white/5">
                      <span>Total Invoice</span>
                      <span className="text-[#D4AF37]">PKR {order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs space-y-2 text-gray-400">
                    <div>
                      <p className="font-semibold text-white mb-0.5">Shipping Address</p>
                      <p className="line-clamp-2">{order.customerAddress}</p>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span>Payment Method</span>
                      <span className="text-white uppercase">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
