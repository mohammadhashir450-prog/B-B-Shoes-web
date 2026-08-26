'use client';

import React from 'react';

interface SaleBadgeProps {
  discount?: number;
  saleType?: 'flat' | 'upto' | string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function SaleBadge({
  discount,
  saleType = 'flat',
  className = '',
  size = 'sm',
}: SaleBadgeProps) {
  if (!discount || discount <= 0) return null;

  const normalizedType = String(saleType || 'flat').toLowerCase();
  const label =
    normalizedType === 'upto'
      ? `UPTO ${discount}% OFF`
      : normalizedType === 'flat'
      ? `FLAT ${discount}% OFF`
      : `-${discount}%`;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 font-bold',
    sm: 'text-xs px-2.5 py-1 font-bold',
    md: 'text-sm px-3 py-1.5 font-extrabold',
    lg: 'text-base px-4 py-2 font-black tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg bg-red-600 text-white uppercase tracking-wider shadow-md ${sizeClasses} ${className}`}
    >
      <span>🏷️</span>
      <span>{label}</span>
    </span>
  );
}
