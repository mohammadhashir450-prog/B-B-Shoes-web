'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Product Type
export interface SizeStock {
  size: string | number;
  quantity: number;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  secondaryImage?: string;
  sizeColorImages?: any[];
  category: string;
  subcategory?: string;
  brand?: string;
  sizes?: Array<string | number>;
  colors?: string[];
  description?: string;
  rating?: number;
  reviews?: number;
  isOnSale?: boolean;
  isNewArrival?: boolean;
  inStock?: boolean;
  stock?: number;
  sold?: number;
  sizeStock?: SizeStock[];
}

// Context Type
interface ProductContextType {
  // All Products States
  allProducts: Product[];
  menProducts: Product[];
  womenProducts: Product[];
  
  // Loading & Error States
  loading: boolean;
  error: string | null;
  
  // Helper Functions
  getProductById: (id: string) => Product | undefined;
  getAllProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  getProductsByBrand: (brand: string) => Product[];
  getSaleProducts: () => Product[];
  getNewArrivals: () => Product[];
  searchProducts: (query: string) => Product[];
  
  // Refetch function
  refetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  const [sourceProducts, setSourceProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [menProducts, setMenProducts] = useState<Product[]>([]);
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [salesEndsAt, setSalesEndsAt] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeProduct = (raw: any): Product | null => {
    if (!raw || typeof raw !== 'object') return null;

    const id = String(raw.id || raw._id || '').trim();
    const name = String(raw.name || '').trim();
    const image = String(raw.image || '').trim();
    const category = String(raw.category || '').trim();
    const price = Number(raw.price || 0);

    if (!id || !name || !image || !category || !Number.isFinite(price) || price <= 0) {
      return null;
    }

    return {
      id,
      name,
      image,
      category,
      price,
      originalPrice: Number(raw.originalPrice || 0) || undefined,
      discount: Number(raw.discount || 0) || undefined,
      secondaryImage: raw.secondaryImage,
      sizeColorImages: Array.isArray(raw.sizeColorImages) ? raw.sizeColorImages : [],
      subcategory: raw.subcategory,
      brand: raw.brand,
      sizes: Array.isArray(raw.sizes) ? raw.sizes : [],
      colors: Array.isArray(raw.colors) ? raw.colors : [],
      description: raw.description,
      rating: Number(raw.rating || 0) || undefined,
      reviews: Number(raw.reviews || 0) || undefined,
      isOnSale: Boolean(raw.isOnSale),
      isNewArrival: Boolean(raw.isNewArrival),
      inStock: raw.inStock !== false,
      stock: Number(raw.stock || 0) || undefined,
      sold: Number(raw.sold || 0) || undefined,
      sizeStock: Array.isArray(raw.sizeStock) ? raw.sizeStock : [],
    };
  };

  const getCachedProducts = (): Product[] => {
    if (typeof window === 'undefined') return [];

    const cacheKeys = ['bb_cached_products', 'allProducts'];

    for (const key of cacheKeys) {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) continue;

        const parsed = JSON.parse(raw);
        const normalized = (Array.isArray(parsed) ? parsed : [])
          .map(normalizeProduct)
          .filter((item): item is Product => Boolean(item));

        if (normalized.length > 0) {
          return normalized;
        }
      } catch {
        // Ignore malformed local cache entries.
      }
    }

    return [];
  };

  const saveCachedProducts = (products: Product[]) => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem('bb_cached_products', JSON.stringify(products));
      window.localStorage.setItem('allProducts', JSON.stringify(products));
    } catch {
      // Ignore localStorage write failures.
    }
  };

  const normalizeCategory = (value?: string) =>
    (value || '')
      .toLowerCase()
      .trim()
      .replace(/['’]/g, '')
      .replace(/\s+/g, '');

  const isSaleTaggedProduct = (product: Product): boolean => {
    return product.isOnSale === true || (product.discount || 0) > 0 || ((product.originalPrice || 0) > product.price);
  };

  const isSalesExpired = (timerValue: string | null, currentTick: number): boolean => {
    if (!timerValue) return false;

    const endDate = new Date(timerValue);
    if (Number.isNaN(endDate.getTime())) return false;

    return currentTick > endDate.getTime();
  };

  const isProductVisibleForStorefront = (product: Product): boolean => {
    if (product.inStock === false) {
      return false;
    }

    const hasSizeInventory = Array.isArray(product.sizeStock) && product.sizeStock.length > 0;
    if (hasSizeInventory) {
      return product.sizeStock!.some((entry) => Number(entry.quantity || 0) > 0);
    }

    if (typeof product.stock === 'number') {
      return product.stock > 0;
    }

    return true;
  };

  const buildVisibleProducts = (
    products: Product[],
    timerValue: string | null,
    currentTick: number,
    includeOutOfStock: boolean
  ): Product[] => {
    if (includeOutOfStock) {
      return products;
    }

    if (!isSalesExpired(timerValue, currentTick)) {
      return products.filter(isProductVisibleForStorefront);
    }

    // When sale timer expires, hide sale-tagged products from storefront lists.
    const saleFiltered = products.filter((product) => !isSaleTaggedProduct(product));
    return saleFiltered.filter(isProductVisibleForStorefront);
  };

  const applyVisibleProductBuckets = (products: Product[]) => {
    setAllProducts(products);

    const men = products.filter((p: Product) => {
      const category = normalizeCategory(p.category);
      return category === 'men' || category === 'mens';
    });
    setMenProducts(men);

    const women = products.filter((p: Product) => {
      const category = normalizeCategory(p.category);
      return category === 'women' || category === 'womens';
    });
    setWomenProducts(women);
  };

  const fetchSalesTimer = async (): Promise<string | null> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    try {
      const timerResponse = await fetch('/api/settings/sales-timer', { signal: controller.signal });
      if (timerResponse.ok) {
        const timerData = await timerResponse.json();
        const timerValue = timerData?.data?.salesEndsAt || null;
        setSalesEndsAt(timerValue);
        return timerValue;
      }
    } catch (timerError) {
      console.warn('⚠️ Sales timer fetch skipped:', timerError);
    } finally {
      clearTimeout(timeout);
    }

    return null;
  };

  // Fetch all products once
  const fetchProducts = async () => {
  try {
    const cachedProducts = getCachedProducts();
    setLoading(cachedProducts.length === 0);
    setError(null);

    if (cachedProducts.length > 0) {
      setSourceProducts(cachedProducts);
      const cachedVisible = buildVisibleProducts(cachedProducts, salesEndsAt, Date.now(), isAdminRoute);
      applyVisibleProductBuckets(cachedVisible);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    
    const response = await fetch('/api/products', {
      signal: controller.signal,
      cache: 'default',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    // Parse the JSON
    const responseData = await response.json();

    // Extract products
    const products = Array.isArray(responseData?.data?.products)
      ? responseData.data.products.map(normalizeProduct).filter((item: Product | null): item is Product => Boolean(item))
      : []; 
    
    // Verify images
    const withImages = products.filter((p: Product) => p.image && p.image.trim() !== '');
    const withoutImages = products.filter((p: Product) => !p.image || p.image.trim() === '');
    
    console.log('✅ Products fetched:', {
      total: products.length,
      withImages: withImages.length,
      withoutImages: withoutImages.length
    });
    
    if (withoutImages.length > 0) {
      console.warn('⚠️ Missing images:', withoutImages.map((p: Product) => p.name));
    }
    
    setSourceProducts(products);
    saveCachedProducts(products);

    const visibleProducts = buildVisibleProducts(products, salesEndsAt, Date.now(), isAdminRoute);
    applyVisibleProductBuckets(visibleProducts);

    // Keep sales timer in sync without delaying primary product rendering.
    void fetchSalesTimer();
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
    setError(errorMessage);
    console.error('❌ Error loading products:', err);

    const cachedProducts = getCachedProducts();
    if (cachedProducts.length > 0) {
      setSourceProducts(cachedProducts);
      const cachedVisible = buildVisibleProducts(cachedProducts, salesEndsAt, Date.now(), isAdminRoute);
      applyVisibleProductBuckets(cachedVisible);
    } else {
      setAllProducts([]);
      setSourceProducts([]);
      setMenProducts([]);
      setWomenProducts([]);
    }
  } finally {
    setLoading(false);
  }
};

  // Filter products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Re-check time periodically so sales vanish right after timer expiry.
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Poll timer settings so admin timer changes reflect for users without hard refresh.
  useEffect(() => {
    const timerPoll = setInterval(() => {
      fetchSalesTimer();
    }, 30000);

    return () => clearInterval(timerPoll);
  }, []);

  useEffect(() => {
    const visibleProducts = buildVisibleProducts(sourceProducts, salesEndsAt, nowTick, isAdminRoute);
    applyVisibleProductBuckets(visibleProducts);
  }, [sourceProducts, salesEndsAt, nowTick, isAdminRoute]);

  // Helper: Get product by ID
  const getProductById = (id: string): Product | undefined => {
    return allProducts.find(p => p.id === id);
  };

  // Helper: Get all products
  const getAllProducts = (): Product[] => {
    return allProducts;
  };

  // Helper: Get products by category
  const getProductsByCategory = (category: string): Product[] => {
    const searchCategory = normalizeCategory(category);

    if (searchCategory === 'all') return allProducts;
    if (searchCategory === 'men' || searchCategory === 'mens') return menProducts;
    if (searchCategory === 'women' || searchCategory === 'womens') return womenProducts;
    
    // Handle exact category/subcategory mapping for section pages and filters.
    return allProducts.filter(p => {
      const productCategory = normalizeCategory(p.category);
      const productSubcategory = normalizeCategory((p as any).subcategory);
      
      return productSubcategory === searchCategory || productCategory === searchCategory;
    });
  };

  // Helper: Get products by brand
  const getProductsByBrand = (brand: string): Product[] => {
    return allProducts.filter(p => 
      p.brand?.toLowerCase() === brand.toLowerCase()
    );
  };

  // Helper: Get sale products
  const getSaleProducts = (): Product[] => {
    if (salesEndsAt) {
      const endDate = new Date(salesEndsAt);
      if (!Number.isNaN(endDate.getTime()) && nowTick > endDate.getTime()) {
        return [];
      }
    }

    return allProducts
      .filter((p) => p.isOnSale === true || (p.discount || 0) > 0 || ((p.originalPrice || 0) > p.price))
      .sort((a, b) => (b.discount || 0) - (a.discount || 0));
  };

  // Helper: Get new arrivals
  const getNewArrivals = (): Product[] => {
    const tagged = allProducts.filter((p) => p.isNewArrival === true);

    // Fallback to latest products if new-arrival tags are missing.
    if (tagged.length > 0) {
      return tagged;
    }

    return allProducts.slice(0, 12);
  };

  // Helper: Search products
  const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return allProducts.filter(p => 
      p.name?.toLowerCase().includes(lowercaseQuery) ||
      p.description?.toLowerCase().includes(lowercaseQuery) ||
      p.category?.toLowerCase().includes(lowercaseQuery) ||
      p.brand?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Refetch products (useful after adding/updating products in admin)
  const refetchProducts = async () => {
    await fetchProducts();
  };

  const value: ProductContextType = {
    allProducts,
    menProducts,
    womenProducts,
    loading,
    error,
    getProductById,
    getAllProducts,
    getProductsByCategory,
    getProductsByBrand,
    getSaleProducts,
    getNewArrivals,
    searchProducts,
    refetchProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

// Custom hook to use ProductContext
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
