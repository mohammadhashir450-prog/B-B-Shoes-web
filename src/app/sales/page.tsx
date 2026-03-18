'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useProducts } from '@/context/ProductContext';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const zeroTime: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const calculateTimeLeft = (target: Date): TimeLeft => {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return zeroTime;
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

// Countdown Timer Component
function CountdownTimer() {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(zeroTime);

  useEffect(() => {
    const fetchSalesTimer = async () => {
      try {
        const response = await fetch('/api/settings/sales-timer', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch sales timer');
        }

        const result = await response.json();
        const salesEndsAt = result?.data?.salesEndsAt;

        if (salesEndsAt) {
          const parsed = new Date(salesEndsAt);
          if (!Number.isNaN(parsed.getTime())) {
            setTargetDate(parsed);
            setTimeLeft(calculateTimeLeft(parsed));
            return;
          }
        }

        // Default fallback timer if admin has not configured one yet.
        const fallback = new Date(Date.now() + (2 * 24 + 14) * 60 * 60 * 1000 + 55 * 60 * 1000 + 20 * 1000);
        setTargetDate(fallback);
        setTimeLeft(calculateTimeLeft(fallback));
      } catch {
        const fallback = new Date(Date.now() + (2 * 24 + 14) * 60 * 60 * 1000 + 55 * 60 * 1000 + 20 * 1000);
        setTargetDate(fallback);
        setTimeLeft(calculateTimeLeft(fallback));
      }
    };

    fetchSalesTimer();
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <div>
      <div className="flex items-center justify-center gap-6">
      <div className="text-center">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 min-w-[100px]">
          <div className="text-4xl font-bold mb-1">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="text-[#D4AF37] text-xs tracking-wider uppercase">Days</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 min-w-[100px]">
          <div className="text-4xl font-bold mb-1">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-[#D4AF37] text-xs tracking-wider uppercase">Hours</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 min-w-[100px]">
          <div className="text-4xl font-bold mb-1">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-[#D4AF37] text-xs tracking-wider uppercase">Minutes</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 min-w-[100px]">
          <div className="text-4xl font-bold mb-1">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-[#D4AF37] text-xs tracking-wider uppercase">Seconds</div>
        </div>
      </div>
      </div>
      {isExpired ? (
        <p className="text-red-300 text-sm tracking-[0.2em] uppercase text-center mt-6">Sale Window Closed</p>
      ) : null}
    </div>
  );
}

export default function SalesPage() {
  const { getSaleProducts, loading } = useProducts()
  
  const saleProducts = useMemo(() => {
    return getSaleProducts()
  }, [getSaleProducts])

  return (
    <div className="min-h-screen bg-[#0B101E] text-white">
      <Navbar />

      {/* Hero Section - Golden Season Sale */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-32">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/api/placeholder/1920/1080)',
            filter: 'brightness(0.4)'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 mt-12">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-6 font-serif text-[#D4AF37]">
            GOLDEN SEASON
          </h1>
          <h2 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 font-serif text-[#D4AF37]">
            SALE
          </h2>
          <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-12">
            EXCLUSIVE ACCESS FOR MEMBERS ONLY
          </p>
          
          <CountdownTimer />
        </div>
      </div>

      {/* The Sale Products Section */}
      <div id="sale-products" className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-2">CURATED SELECTION</p>
            <h2 className="text-4xl font-bold">On Sale Now</h2>
          </div>
          <Link 
            href="/collections" 
            className="text-[#D4AF37] hover:text-white transition-colors flex items-center gap-2 group"
          >
            View All Offers
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
          </div>
        ) : saleProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No Sale Items Yet</h2>
            <p className="text-gray-400 mb-8">Check back soon for amazing deals!</p>
            <Link
              href="/"
              className="inline-block bg-[#D4AF37] hover:bg-[#F4CE5C] text-[#0B101E] font-bold py-3 px-8 rounded-full transition-all"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <Link 
                href={`/product/${product.id}`} 
                key={product.id} 
                className="group"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden mb-4 aspect-square">
                  {product.discount && (
                    <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1.5 rounded-lg">
                      <span className="text-xs font-bold">-{product.discount}%</span>
                    </div>
                  )}
                  <Image 
                    src={product.image || '/images/placeholder.jpg'} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={product.image?.includes('cloudinary')}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm border border-[#D4AF37] text-[#D4AF37] px-3 py-1 rounded-full">
                    <span className="text-xs font-bold tracking-wider">SALE</span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-gray-400 text-xs tracking-wider uppercase mb-1">{product.brand}</p>
                  <h3 className="text-xl font-bold mb-1 text-white">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-1">{product.category}</p>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#D4AF37] font-bold text-lg">PKR {product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through text-sm">PKR {product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* VIP Access CTA */}
      <div className="bg-[#0B101E] py-16">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <Link 
            href="/collections"
            className="inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-white text-black px-12 py-5 rounded-full font-bold text-lg tracking-wider transition-all group"
          >
            <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </span>
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
