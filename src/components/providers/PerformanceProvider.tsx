/**
 * Performance Provider Component
 * Initializes performance monitoring for the application
 */
'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/performance-monitoring';

export default function PerformanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize performance monitoring on mount
    if (typeof window !== 'undefined') {
      initPerformanceMonitoring();
    }
  }, []);

  return <>{children}</>;
}
