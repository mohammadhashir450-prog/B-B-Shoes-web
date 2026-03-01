/**
 * Performance Monitoring Utilities for B&B Shoes E-commerce
 * Tracks and reports performance metrics
 */

/**
 * Performance metric types
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

/**
 * Web Vitals thresholds
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint
  FID: { good: 100, poor: 300 },        // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte
  INP: { good: 200, poor: 500 },        // Interaction to Next Paint
} as const;

/**
 * Get rating for a metric value
 */
function getRating(
  value: number,
  metricName: keyof typeof THRESHOLDS
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report performance metric
 */
function reportMetric(metric: PerformanceMetric): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
    });
  }

  // In production, you could send to analytics service
  // Example: sendToAnalytics(metric);
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(): void {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      
      if (lastEntry) {
        const metric: PerformanceMetric = {
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: getRating(lastEntry.renderTime || lastEntry.loadTime, 'LCP'),
          timestamp: Date.now(),
        };
        reportMetric(metric);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (error) {
    console.warn('LCP measurement not supported');
  }
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID(): void {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const metric: PerformanceMetric = {
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: getRating(entry.processingStart - entry.startTime, 'FID'),
          timestamp: Date.now(),
        };
        reportMetric(metric);
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
  } catch (error) {
    console.warn('FID measurement not supported');
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(): void {
  if (typeof window === 'undefined') return;

  try {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      const metric: PerformanceMetric = {
        name: 'CLS',
        value: clsValue,
        rating: getRating(clsValue, 'CLS'),
        timestamp: Date.now(),
      };
      reportMetric(metric);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    console.warn('CLS measurement not supported');
  }
}

/**
 * Measure First Contentful Paint (FCP)
 */
export function measureFCP(): void {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const metric: PerformanceMetric = {
          name: 'FCP',
          value: entry.startTime,
          rating: getRating(entry.startTime, 'FCP'),
          timestamp: Date.now(),
        };
        reportMetric(metric);
      });
    });

    observer.observe({ entryTypes: ['paint'] });
  } catch (error) {
    console.warn('FCP measurement not supported');
  }
}

/**
 * Measure Time to First Byte (TTFB)
 */
export function measureTTFB(): void {
  if (typeof window === 'undefined' || !window.performance) return;

  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      const metric: PerformanceMetric = {
        name: 'TTFB',
        value: ttfb,
        rating: getRating(ttfb, 'TTFB'),
        timestamp: Date.now(),
      };
      reportMetric(metric);
    }
  } catch (error) {
    console.warn('TTFB measurement not supported');
  }
}

/**
 * Measure page load time
 */
export function measurePageLoad(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    console.log('[Performance] Page Load Time:', pageLoadTime + 'ms');
    console.log('[Performance] DOM Ready Time:', perfData.domContentLoadedEventEnd - perfData.navigationStart + 'ms');
  });
}

/**
 * Initialize all performance measurements
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  measureLCP();
  measureFID();
  measureCLS();
  measureFCP();
  measureTTFB();
  measurePageLoad();
}

/**
 * Track component render time
 */
export class RenderTimer {
  private startTime: number;
  private componentName: string;

  constructor(componentName: string) {
    this.componentName = componentName;
    this.startTime = performance.now();
  }

  end(): void {
    const duration = performance.now() - this.startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Render] ${this.componentName}: ${duration.toFixed(2)}ms`);
    }
  }
}

/**
 * Measure API call duration
 */
export async function measureAPICall<T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${name}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`[API Error] ${name}: ${duration.toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Get current memory usage (if available)
 */
export function getMemoryUsage(): { used: number; total: number; percentage: number } | null {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
    total: Math.round(memory.totalJSHeapSize / 1048576),
    percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100),
  };
}

/**
 * Monitor long tasks (tasks taking > 50ms)
 */
export function monitorLongTasks(): void {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.warn(`[Long Task] Duration: ${entry.duration.toFixed(2)}ms`, entry);
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    console.warn('Long task monitoring not supported');
  }
}

/**
 * Create a performance mark
 */
export function mark(name: string): void {
  if (typeof window !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure between two marks
 */
export function measure(name: string, startMark: string, endMark: string): number | null {
  if (typeof window === 'undefined' || !performance.measure) return null;

  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Measure] ${name}: ${measure.duration.toFixed(2)}ms`);
    }
    return measure.duration;
  } catch (error) {
    console.warn(`Failed to measure ${name}:`, error);
    return null;
  }
}
