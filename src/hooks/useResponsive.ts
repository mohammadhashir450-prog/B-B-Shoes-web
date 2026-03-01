/**
 * Custom React Hooks for Responsive Design
 * Provides hooks for responsive behavior in components
 */
'use client';

import { useState, useEffect } from 'react';
import {
  breakpoints,
  type Breakpoint,
  getCurrentBreakpoint,
  isMobile as checkIsMobile,
  isTablet as checkIsTablet,
  isDesktop as checkIsDesktop,
  getViewportDimensions,
  debounce,
} from '@/lib/responsive-utils';

/**
 * Hook to get current viewport dimensions
 * Updates on window resize
 */
export function useViewportDimensions() {
  const [dimensions, setDimensions] = useState(() => getViewportDimensions());

  useEffect(() => {
    const handleResize = debounce(() => {
      setDimensions(getViewportDimensions());
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

/**
 * Hook to check if viewport matches a specific breakpoint
 * @param breakpoint - Breakpoint to check
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints[breakpoint];
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setMatches(window.innerWidth >= breakpoints[breakpoint]);
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return matches;
}

/**
 * Hook to get current breakpoint name
 */
export function useCurrentBreakpoint(): Breakpoint | 'xs' {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | 'xs'>(() => getCurrentBreakpoint());

  useEffect(() => {
    const handleResize = debounce(() => {
      setBreakpoint(getCurrentBreakpoint());
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/**
 * Hook to check if device is mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return checkIsMobile();
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(checkIsMobile());
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

/**
 * Hook to check if device is tablet
 */
export function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return checkIsTablet();
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsTablet(checkIsTablet());
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isTablet;
}

/**
 * Hook to check if device is desktop
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return checkIsDesktop();
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsDesktop(checkIsDesktop());
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
}

/**
 * Hook to get responsive value based on current breakpoint
 * @param values - Object with values for each breakpoint
 */
export function useResponsiveValue<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T | undefined {
  const breakpoint = useCurrentBreakpoint();
  
  // Return value for current or nearest lower breakpoint
  if (breakpoint === '2xl' && values['2xl']) return values['2xl'];
  if (breakpoint === 'xl' && values.xl) return values.xl;
  if (breakpoint === 'lg' && values.lg) return values.lg;
  if (breakpoint === 'md' && values.md) return values.md;
  if (breakpoint === 'sm' && values.sm) return values.sm;
  if (values.xs) return values.xs;
  
  // Fallback to any available value
  return values['2xl'] || values.xl || values.lg || values.md || values.sm || values.xs;
}

/**
 * Hook for media query matching
 * @param query - Media query string
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Hook to detect orientation change
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    const handleOrientationChange = debounce(() => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    }, 150);

    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return orientation;
}

/**
 * Hook to detect scroll position
 */
export function useScrollPosition(): { x: number; y: number } {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = debounce(() => {
      setPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return position;
}

/**
 * Hook to detect if element is in viewport
 * @param ref - React ref to the element
 * @param options - Intersection observer options
 */
export function useInViewport<T extends HTMLElement>(
  ref: React.RefObject<T>,
  options?: IntersectionObserverInit
): boolean {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isInViewport;
}
