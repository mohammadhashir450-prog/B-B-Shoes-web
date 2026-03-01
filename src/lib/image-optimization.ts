/**
 * Image Optimization Helper for B&B Shoes E-commerce
 * Provides utilities for optimizing images
 */

import type { ImageProps } from 'next/image';

/**
 * Common image sizes for responsive images
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  hero: { width: 1920, height: 1080 },
} as const;

/**
 * Device sizes for responsive images
 */
export const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/**
 * Image quality settings
 */
export const IMAGE_QUALITY = {
  low: 50,
  medium: 75,
  high: 85,
  max: 95,
} as const;

/**
 * Generate responsive image sizes string for srcSet
 * @param breakpoints - Array of breakpoints with sizes
 * @returns sizes string for Next.js Image component
 */
export function generateImageSizes(breakpoints: {
  breakpoint?: string;
  size: string;
}[]): string {
  return breakpoints
    .map(({ breakpoint, size }) => 
      breakpoint ? `(max-width: ${breakpoint}) ${size}` : size
    )
    .join(', ');
}

/**
 * Common responsive image sizes configurations
 */
export const RESPONSIVE_IMAGE_SIZES = {
  // Full width on mobile, half width on tablet, 1/3 on desktop
  gridThirds: generateImageSizes([
    { breakpoint: '640px', size: '100vw' },
    { breakpoint: '768px', size: '50vw' },
    { breakpoint: '1024px', size: '33vw' },
    { size: '33vw' },
  ]),
  
  // Full width on mobile, half width on desktop
  gridHalves: generateImageSizes([
    { breakpoint: '768px', size: '100vw' },
    { size: '50vw' },
  ]),
  
  // Full width on mobile, 1/4 on desktop
  gridQuarters: generateImageSizes([
    { breakpoint: '640px', size: '100vw' },
    { breakpoint: '768px', size: '50vw' },
    { breakpoint: '1024px', size: '33vw' },
    { size: '25vw' },
  ]),
  
  // Full width hero images
  hero: '100vw',
  
  // Product thumbnails
  thumbnail: generateImageSizes([
    { breakpoint: '640px', size: '150px' },
    { size: '200px' },
  ]),
  
  // Product images
  product: generateImageSizes([
    { breakpoint: '640px', size: '100vw' },
    { breakpoint: '768px', size: '50vw' },
    { size: '600px' },
  ]),
} as const;

/**
 * Get optimized image props for Next.js Image component
 * @param src - Image source
 * @param alt - Alt text
 * @param options - Additional options
 * @returns Partial ImageProps
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  options: {
    priority?: boolean;
    quality?: keyof typeof IMAGE_QUALITY;
    sizes?: string;
    fill?: boolean;
    width?: number;
    height?: number;
  } = {}
): Partial<ImageProps> {
  const {
    priority = false,
    quality = 'high',
    sizes,
    fill = false,
    width,
    height,
  } = options;

  const baseProps: Partial<ImageProps> = {
    src,
    alt,
    quality: IMAGE_QUALITY[quality],
    priority,
    loading: priority ? 'eager' : 'lazy',
  };

  if (fill) {
    return {
      ...baseProps,
      fill: true,
      sizes: sizes || '100vw',
      style: { objectFit: 'cover' },
    };
  }

  if (width && height) {
    return {
      ...baseProps,
      width,
      height,
      sizes,
    };
  }

  return baseProps;
}

/**
 * Generate blur data URL for placeholder
 * @param width - Width of blur image
 * @param height - Height of blur image
 * @returns Data URL for blur placeholder
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10
): string {
  const canvas = typeof document !== 'undefined' 
    ? document.createElement('canvas') 
    : null;
    
  if (!canvas) {
    // Return a simple gray gradient as fallback
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZWVlIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZGRkIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==';
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL();
}

/**
 * Preload important images
 * @param images - Array of image URLs to preload
 */
export function preloadImages(images: string[]): void {
  if (typeof window === 'undefined') return;

  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images with Intersection Observer
 * @param imgElement - Image element to lazy load
 * @param src - Image source
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  src: string
): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    imgElement.src = src;
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imgElement.src = src;
        imgElement.classList.add('loaded');
        observer.unobserve(imgElement);
      }
    });
  }, {
    rootMargin: '50px',
  });

  observer.observe(imgElement);
}

/**
 * Get image format based on browser support
 * @returns Preferred image format
 */
export function getPreferredImageFormat(): 'webp' | 'avif' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg';

  // Check for AVIF support
  const avifSupport = document.createElement('canvas')
    .toDataURL('image/avif')
    .indexOf('data:image/avif') === 0;
  
  if (avifSupport) return 'avif';

  // Check for WebP support
  const webpSupport = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
  
  if (webpSupport) return 'webp';

  return 'jpeg';
}

/**
 * Calculate aspect ratio for responsive images
 * @param width - Image width
 * @param height - Image height
 * @returns Aspect ratio string
 */
export function getAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}
