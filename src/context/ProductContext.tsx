'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Product Type
export interface SizeStock {
  size: string;
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
  sizes?: string[];
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [menProducts, setMenProducts] = useState<Product[]>([]);
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [salesEndsAt, setSalesEndsAt] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState<number>(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeCategory = (value?: string) =>
    (value || '')
      .toLowerCase()
      .trim()
      .replace(/['’]/g, '')
      .replace(/\s+/g, '');

  const fetchSalesTimer = async () => {
    try {
      const timerResponse = await fetch('/api/settings/sales-timer', { cache: 'no-store' });
      if (timerResponse.ok) {
        const timerData = await timerResponse.json();
        setSalesEndsAt(timerData?.data?.salesEndsAt || null);
      }
    } catch (timerError) {
      console.warn('⚠️ Sales timer fetch skipped:', timerError);
    }
  };

  // Fetch all products once
  const fetchProducts = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch('/api/products', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    // Parse the JSON
    const responseData = await response.json();

    // Keep sales timer in sync with admin panel settings.
    await fetchSalesTimer();
    
    // Extract products
    const products = responseData.data?.products || []; 
    
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
    
    // Set all products
    setAllProducts(products);
    
    // Filter Men products
    const men = products.filter((p: Product) => {
      const category = normalizeCategory(p.category);
      return category === 'men' || category === 'mens';
    });
    setMenProducts(men);
    
    // Filter Women products
    const women = products.filter((p: Product) => {
      const category = normalizeCategory(p.category);
      return category === 'women' || category === 'womens';
    });
    setWomenProducts(women);
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
    setError(errorMessage);
    console.error('❌ Error loading products:', err);
    
    setAllProducts([]);
    setMenProducts([]);
    setWomenProducts([]);
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
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Poll timer settings so admin timer changes reflect for users without hard refresh.
  useEffect(() => {
    const timerPoll = setInterval(() => {
      fetchSalesTimer();
    }, 30000);

    return () => clearInterval(timerPoll);
  }, []);

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
