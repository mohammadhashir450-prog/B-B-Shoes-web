'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Product Type
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  sizeColorImages?: any[];
  category: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products once
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      const products = data.products || [];
      
      // Set all products
      setAllProducts(products);
      
      // Filter and set Men products
      const men = products.filter((p: Product) => 
        p.category?.toLowerCase() === 'men' || 
        p.category?.toLowerCase() === 'men\'s'
      );
      setMenProducts(men);
      
      // Filter and set Women products
      const women = products.filter((p: Product) => 
        p.category?.toLowerCase() === 'women' || 
        p.category?.toLowerCase() === 'women\'s'
      );
      setWomenProducts(women);
      
      console.log('✅ Products loaded in context:', {
        total: products.length,
        men: men.length,
        women: women.length
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('❌ Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper: Get product by ID
  const getProductById = (id: string): Product | undefined => {
    return allProducts.find(p => p.id === id);
  };

  // Helper: Get products by category
  const getProductsByCategory = (category: string): Product[] => {
    if (category.toLowerCase() === 'all') return allProducts;
    if (category.toLowerCase() === 'men' || category.toLowerCase() === 'men\'s') return menProducts;
    if (category.toLowerCase() === 'women' || category.toLowerCase() === 'women\'s') return womenProducts;
    
    return allProducts.filter(p => 
      p.category?.toLowerCase() === category.toLowerCase()
    );
  };

  // Helper: Get products by brand
  const getProductsByBrand = (brand: string): Product[] => {
    return allProducts.filter(p => 
      p.brand?.toLowerCase() === brand.toLowerCase()
    );
  };

  // Helper: Get sale products
  const getSaleProducts = (): Product[] => {
    return allProducts.filter(p => p.isOnSale === true);
  };

  // Helper: Get new arrivals
  const getNewArrivals = (): Product[] => {
    return allProducts.filter(p => p.isNewArrival === true);
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
