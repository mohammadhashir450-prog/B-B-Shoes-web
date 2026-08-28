'use client';

import { useEffect, useState, useCallback } from 'react';

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

// Module-level cache shared across all hook instances
let cached: ShippingConfig | null = null;
let fetchPromise: Promise<ShippingConfig> | null = null;

// Subscribers: called whenever the config updates so all mounted instances re-render
const subscribers = new Set<(c: ShippingConfig) => void>();

function broadcast(config: ShippingConfig) {
  cached = config;
  subscribers.forEach((fn) => fn(config));
}

async function fetchConfig(): Promise<ShippingConfig> {
  if (fetchPromise) return fetchPromise; // de-duplicate concurrent calls
  fetchPromise = (async () => {
    try {
      const res = await fetch('/api/settings/shipping', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) return json.data as ShippingConfig;
    } catch {}
    return DEFAULT;
  })();
  const result = await fetchPromise;
  fetchPromise = null;
  return result;
}

/** Returns the active shipping config and computed fee for the given cart total. */
export function useShipping(cartTotal = 0) {
  const [config, setConfig] = useState<ShippingConfig>(cached ?? DEFAULT);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let mounted = true;

    // Subscribe to future config broadcasts (e.g. after admin saves)
    const handleUpdate = (c: ShippingConfig) => {
      if (mounted) setConfig(c);
    };
    subscribers.add(handleUpdate);

    // If already cached, use it immediately
    if (cached) {
      setConfig(cached);
      setLoading(false);
    } else {
      // Fetch from API
      fetchConfig().then((c) => {
        if (mounted) {
          setLoading(false);
        }
        broadcast(c);
      });
    }

    return () => {
      mounted = false;
      subscribers.delete(handleUpdate);
    };
  }, []);

  /** Actual fee to charge for a given cart total */
  const computeFee = useCallback(
    (total: number) => {
      if (config.isFree) return 0; // globally free (no threshold check needed — admin explicitly set free)
      if (config.fee === 0) return 0; // fee is zero, treat as free
      if (config.freeThreshold > 0 && total >= config.freeThreshold) return 0; // cart qualifies for free
      return config.fee;
    },
    [config]
  );

  const fee = computeFee(cartTotal);
  const isFreeForCart = fee === 0;

  return { config, loading, fee, isFreeForCart };
}

/** Invalidate cached config (call after admin saves new settings).
 *  This forces all mounted hook instances to re-fetch immediately. */
export function invalidateShippingCache() {
  cached = null;
  fetchPromise = null;
  // Trigger a fresh fetch and broadcast the result to all subscribers
  fetchConfig().then((c) => broadcast(c));
}
