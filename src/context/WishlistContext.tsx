'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

interface WishlistContextType {
  wishlistIds: string[];
  totalWishlistItems: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'bb-wishlist-items';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem(STORAGE_KEY);
    if (!savedWishlist) return;

    try {
      const parsed = JSON.parse(savedWishlist);
      if (Array.isArray(parsed)) {
        setWishlistIds(parsed.filter((id) => typeof id === 'string'));
      }
    } catch {
      setWishlistIds([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const toggleWishlist = (productId: string) => {
    if (!productId) return;

    setWishlistIds((prev) => (
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    ));
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  const value: WishlistContextType = useMemo(() => ({
    wishlistIds,
    totalWishlistItems: wishlistIds.length,
    isWishlisted: (productId: string) => wishlistIds.includes(productId),
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  }), [wishlistIds]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
