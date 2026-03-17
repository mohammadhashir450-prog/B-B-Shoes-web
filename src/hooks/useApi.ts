/**
 * Custom Hooks for API Integration
 * Professional data fetching with loading and error states
 */

'use client';

import { useState, useEffect } from 'react';
import { useRef } from 'react';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showToast?: boolean;
}

// Generic GET request hook
export function useFetch<T>(url: string, options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onSuccessRef = useRef<UseApiOptions['onSuccess']>(options?.onSuccess);
  const onErrorRef = useRef<UseApiOptions['onError']>(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  }, [options?.onSuccess, options?.onError]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch data');
        }

        setData(result.data || result);
        
        if (onSuccessRef.current) {
          onSuccessRef.current(result.data || result);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred';
        setError(errorMessage);
        
        if (onErrorRef.current) {
          onErrorRef.current(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error, refetch: () => {} };
}

// POST/PUT/DELETE request hook
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (
    url: string,
    method: 'POST' | 'PUT' | 'DELETE',
    body?: any,
    options?: UseApiOptions
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Request failed');
      }

      if (options?.onSuccess) {
        options.onSuccess(result.data || result);
      }

      return result.data || result;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);

      if (options?.onError) {
        options.onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const post = (url: string, body: any, options?: UseApiOptions) => 
    request(url, 'POST', body, options);

  const put = (url: string, body: any, options?: UseApiOptions) => 
    request(url, 'PUT', body, options);

  const del = (url: string, options?: UseApiOptions) => 
    request(url, 'DELETE', undefined, options);

  return { post, put, del, loading, error };
}

// Products Hook
export function useProducts(filters?: { category?: string; isOnSale?: boolean; brand?: string }) {
  const queryParams = new URLSearchParams();
  if (filters?.category) queryParams.append('category', filters.category);
  if (filters?.isOnSale !== undefined) queryParams.append('isOnSale', String(filters.isOnSale));
  if (filters?.brand) queryParams.append('brand', filters.brand);

  const url = `/api/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  return useFetch<{ count: number; products: any[] }>(url);
}

// Single Product Hook
export function useProduct(id: string) {
  return useFetch<any>(`/api/products/${id}`);
}

// Orders Hook
export function useOrders(filters?: { status?: string; email?: string }) {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.email) queryParams.append('email', filters.email);

  const url = `/api/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  return useFetch<{ count: number; orders: any[] }>(url);
}

// Auth hooks
export function useAuth() {
  const { post, loading, error } = useApi();

  const login = async (email: string, password: string) => {
    try {
      const result = await post('/api/auth/login', { email, password }, {
        onSuccess: (data) => {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data));
        }
      });
      return result;
    } catch (err) {
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await post('/api/auth/register', { name, email, password }, {
        showToast: true,
        onSuccess: (data) => {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data));
        }
      });
      return result;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return { login, register, logout, loading, error };
}
