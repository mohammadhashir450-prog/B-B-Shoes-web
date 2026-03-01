/**
 * Caching Strategy Configuration for B&B Shoes E-commerce
 * Implements client-side and server-side caching strategies
 */

// Cache duration constants (in seconds)
export const CACHE_DURATIONS = {
  STATIC: 31536000,      // 1 year for static assets
  IMAGES: 2592000,       // 30 days for images
  API_SHORT: 60,         // 1 minute for frequently changing API data
  API_MEDIUM: 300,       // 5 minutes for moderately changing data
  API_LONG: 3600,        // 1 hour for rarely changing data
  PAGE_SHORT: 60,        // 1 minute for dynamic pages
  PAGE_MEDIUM: 300,      // 5 minutes for semi-static pages
  PAGE_LONG: 3600,       // 1 hour for mostly static pages
} as const;

// Cache control headers for different content types
export const CACHE_HEADERS = {
  // Static assets (CSS, JS, fonts) - cache for 1 year
  static: {
    'Cache-Control': `public, max-age=${CACHE_DURATIONS.STATIC}, immutable`,
    'Vary': 'Accept-Encoding',
  },
  
  // Images - cache for 30 days
  images: {
    'Cache-Control': `public, max-age=${CACHE_DURATIONS.IMAGES}`,
    'Vary': 'Accept',
  },
  
  // API responses - short cache
  apiShort: {
    'Cache-Control': `public, max-age=${CACHE_DURATIONS.API_SHORT}, stale-while-revalidate=${CACHE_DURATIONS.API_SHORT * 2}`,
    'Vary': 'Accept, Accept-Encoding',
  },
  
  // API responses - medium cache
  apiMedium: {
    'Cache-Control': `public, max-age=${CACHE_DURATIONS.API_MEDIUM}, stale-while-revalidate=${CACHE_DURATIONS.API_MEDIUM * 2}`,
    'Vary': 'Accept, Accept-Encoding',
  },
  
  // API responses - long cache
  apiLong: {
    'Cache-Control': `public, max-age=${CACHE_DURATIONS.API_LONG}, stale-while-revalidate=${CACHE_DURATIONS.API_LONG * 2}`,
    'Vary': 'Accept, Accept-Encoding',
  },
  
  // No cache for sensitive data
  noCache: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  
  // Pages - short cache with revalidation
  pageShort: {
    'Cache-Control': `public, max-age=${CACHE_DURATIONS.PAGE_SHORT}, stale-while-revalidate=${CACHE_DURATIONS.PAGE_SHORT * 5}`,
  },
  
  // Pages - medium cache with revalidation
  pageMedium: {
    'Cache-Control': `public, max-age=${CACHE_DURATIONS.PAGE_MEDIUM}, stale-while-revalidate=${CACHE_DURATIONS.PAGE_MEDIUM * 3}`,
  },
  
  // Pages - long cache with revalidation
  pageLong: {
    'Cache-Control': `public, max-age=${CACHE_DURATIONS.PAGE_LONG}, stale-while-revalidate=${CACHE_DURATIONS.PAGE_LONG * 2}`,
  },
} as const;

/**
 * Apply cache headers to Next.js API response
 * @param headers - Headers object to modify
 * @param cacheType - Type of cache to apply
 */
export const applyCacheHeaders = (
  headers: Headers,
  cacheType: keyof typeof CACHE_HEADERS
): void => {
  const cacheConfig = CACHE_HEADERS[cacheType];
  Object.entries(cacheConfig).forEach(([key, value]) => {
    headers.set(key, value);
  });
};

/**
 * Client-side cache using localStorage with expiration
 */
export class ClientCache {
  private static prefix = 'bb_cache_';

  /**
   * Set item in cache with expiration
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in seconds
   */
  static set(key: string, data: any, ttl: number): void {
    if (typeof window === 'undefined') return;

    const item = {
      data,
      expiry: Date.now() + (ttl * 1000),
    };

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  /**
   * Get item from cache
   * @param key - Cache key
   * @returns Cached data or null if expired/not found
   */
  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      // Check if expired
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.data as T;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  /**
   * Remove item from cache
   * @param key - Cache key
   */
  static remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * Clear all cached items
   */
  static clear(): void {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Check if item exists in cache and is not expired
   * @param key - Cache key
   * @returns boolean
   */
  static has(key: string): boolean {
    return this.get(key) !== null;
  }
}

/**
 * Memory cache for server-side or short-term client-side caching
 */
export class MemoryCache {
  private static cache = new Map<string, { data: any; expiry: number }>();

  /**
   * Set item in memory cache
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in seconds
   */
  static set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttl * 1000),
    });
  }

  /**
   * Get item from memory cache
   * @param key - Cache key
   * @returns Cached data or null if expired/not found
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * Remove item from memory cache
   * @param key - Cache key
   */
  static remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cached items
   */
  static clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns Number of items in cache
   */
  static size(): number {
    return this.cache.size;
  }
}

/**
 * Fetch with cache wrapper
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param cacheKey - Cache key (defaults to URL)
 * @param cacheTTL - Cache TTL in seconds
 * @returns Fetch response data
 */
export async function fetchWithCache<T>(
  url: string,
  options?: RequestInit,
  cacheKey?: string,
  cacheTTL: number = CACHE_DURATIONS.API_MEDIUM
): Promise<T> {
  const key = cacheKey || url;

  // Try to get from cache first
  const cached = ClientCache.get<T>(key);
  if (cached) {
    return cached;
  }

  // Fetch fresh data
  const response = await fetch(url, options);
  const data = await response.json();

  // Cache the result
  ClientCache.set(key, data, cacheTTL);

  return data;
}

/**
 * Prefetch and cache resources
 * @param urls - Array of URLs to prefetch
 */
export const prefetchResources = (urls: string[]): void => {
  if (typeof window === 'undefined') return;

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Preload critical resources
 * @param urls - Array of URLs to preload
 * @param type - Resource type (script, style, image, etc.)
 */
export const preloadResources = (
  urls: string[],
  type: 'script' | 'style' | 'image' | 'font' | 'fetch' = 'fetch'
): void => {
  if (typeof window === 'undefined') return;

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    if (type === 'font') {
      link.setAttribute('crossorigin', 'anonymous');
    }
    document.head.appendChild(link);
  });
};
