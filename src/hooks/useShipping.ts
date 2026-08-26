'use client';

import { useEffect, useState } from 'react';

export interface ShippingConfig {
  fee: number;
  isFree: boolean;
  freeThreshold: number;
  label: string;
}

const DEFAULT: ShippingConfig = {
  fee: 0,
  isFree: true,
  freeThreshold: 0,
  label: 'Free',
};

let cached: ShippingConfig | null = null;
const listeners: Array<(c: ShippingConfig) => void> = [];

async function fetchConfig(): Promise<ShippingConfig> {
  try {
    const res = await fetch('/api/settings/shipping', { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data) return json.data as ShippingConfig;
  } catch {}
  return DEFAULT;
}

/** Returns the active shipping config and a function to compute the fee for a given cart total. */
export function useShipping(cartTotal = 0) {
  const [config, setConfig] = useState<ShippingConfig>(cached ?? DEFAULT);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let mounted = true;
    if (cached) { setConfig(cached); setLoading(false); return; }
    fetchConfig().then((c) => {
      cached = c;
      if (mounted) { setConfig(c); setLoading(false); }
      listeners.forEach((fn) => fn(c));
    });
    return () => { mounted = false; };
  }, []);

  /** Actual fee to charge for a given cart total */
  const computeFee = (total: number) => {
    if (config.isFree && config.freeThreshold === 0) return 0; // globally free
    if (config.isFree) return 0;
    if (config.freeThreshold > 0 && total >= config.freeThreshold) return 0;
    return config.fee;
  };

  const fee = computeFee(cartTotal);
  const isFreeForCart = fee === 0;

  return { config, loading, fee, isFreeForCart };
}

/** Invalidate cached config (call after admin saves new settings) */
export function invalidateShippingCache() {
  cached = null;
}
