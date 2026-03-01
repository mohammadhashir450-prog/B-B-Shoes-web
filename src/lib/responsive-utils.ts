/**
 * Responsive Utilities for B&B Shoes E-commerce
 * Provides helper functions and constants for responsive design
 */

// Breakpoint values matching Tailwind CSS defaults
export const breakpoints = {
  sm: 640,   // Small devices (mobile landscape)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (desktop)
  xl: 1280,  // Extra large devices (large desktop)
  '2xl': 1536, // 2X Extra large devices
} as const;

// Type for breakpoint keys
export type Breakpoint = keyof typeof breakpoints;

/**
 * Check if current viewport matches a specific breakpoint
 * @param breakpoint - Breakpoint to check
 * @returns boolean indicating if viewport is at or above the breakpoint
 */
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
};

/**
 * Get current breakpoint name
 * @returns Current breakpoint name (sm, md, lg, xl, 2xl)
 */
export const getCurrentBreakpoint = (): Breakpoint | 'xs' => {
  if (typeof window === 'undefined') return 'xs';
  
  const width = window.innerWidth;
  
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

/**
 * Check if device is mobile
 * @returns boolean indicating if device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
};

/**
 * Check if device is tablet
 * @returns boolean indicating if device is tablet
 */
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
};

/**
 * Check if device is desktop
 * @returns boolean indicating if device is desktop
 */
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
};

/**
 * Responsive class helper
 * Generate responsive Tailwind classes easily
 */
export const responsiveClass = {
  // Container padding
  containerPadding: 'px-4 sm:px-6 lg:px-8',
  
  // Max width containers
  maxWidthSm: 'max-w-screen-sm',
  maxWidthMd: 'max-w-screen-md',
  maxWidthLg: 'max-w-screen-lg',
  maxWidthXl: 'max-w-screen-xl',
  maxWidth2xl: 'max-w-screen-2xl',
  
  // Text sizing
  textBase: 'text-sm sm:text-base',
  textLg: 'text-base sm:text-lg md:text-xl',
  textXl: 'text-lg sm:text-xl md:text-2xl',
  text2xl: 'text-xl sm:text-2xl md:text-3xl',
  text3xl: 'text-2xl sm:text-3xl md:text-4xl',
  text4xl: 'text-3xl sm:text-4xl md:text-5xl',
  text5xl: 'text-4xl sm:text-5xl md:text-6xl',
  
  // Heading sizes
  h1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold',
  h2: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold',
  h3: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold',
  h4: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold',
  h5: 'text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold',
  h6: 'text-base sm:text-lg md:text-xl lg:text-2xl font-bold',
  
  // Spacing
  spacingBase: 'space-y-4 sm:space-y-6 md:space-y-8',
  spacingLg: 'space-y-6 sm:space-y-8 md:space-y-12',
  spacingXl: 'space-y-8 sm:space-y-12 md:space-y-16',
  
  // Grid layouts
  grid2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  grid3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
  grid4: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4',
  
  // Flex layouts
  flexCol: 'flex flex-col',
  flexRow: 'flex flex-col sm:flex-row',
  flexWrap: 'flex flex-wrap',
  
  // Button sizing
  btnSm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-sm',
  btnMd: 'px-4 py-2 sm:px-6 sm:py-3 text-base',
  btnLg: 'px-6 py-3 sm:px-8 sm:py-4 text-lg',
  
  // Image sizing
  imgSm: 'w-16 h-16 sm:w-20 sm:h-20',
  imgMd: 'w-24 h-24 sm:w-32 sm:h-32',
  imgLg: 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48',
  
  // Card padding
  cardPadding: 'p-4 sm:p-6 md:p-8',
  
  // Section padding
  sectionPadding: 'py-8 sm:py-12 md:py-16 lg:py-20',
} as const;

/**
 * Detect touch device
 * @returns boolean indicating if device supports touch
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get viewport dimensions
 * @returns Object containing width and height
 */
export const getViewportDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Debounce function for resize events
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Hook for responsive value selection
 * Returns different values based on current breakpoint
 */
export const getResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T | undefined => {
  const breakpoint = getCurrentBreakpoint();
  
  // Return value for current or nearest lower breakpoint
  if (breakpoint === '2xl' && values['2xl']) return values['2xl'];
  if (breakpoint === 'xl' && values.xl) return values.xl;
  if (breakpoint === 'lg' && values.lg) return values.lg;
  if (breakpoint === 'md' && values.md) return values.md;
  if (breakpoint === 'sm' && values.sm) return values.sm;
  if (values.xs) return values.xs;
  
  // Fallback to any available value
  return values['2xl'] || values.xl || values.lg || values.md || values.sm || values.xs;
};
