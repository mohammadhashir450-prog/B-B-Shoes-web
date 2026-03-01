/** @type {import('next').NextConfig} */

const nextConfig = {

  // Image Optimization

  images: {

    remotePatterns: [

      {

        protocol: "https",

        hostname: "images.unsplash.com",

      },

      {

        protocol: "https",

        hostname: "via.placeholder.com",

      },

      {

        protocol: "https",

        hostname: "lh3.googleusercontent.com", // Google profile images

      },

      {

        protocol: "https",

        hostname: "res.cloudinary.com", // Cloudinary images

      },

    ],

    // Device sizes for responsive images

    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different breakpoints

    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Use WebP format for better performance

    formats: ['image/webp'],

    // Cache optimized images for 60 seconds minimum

    minimumCacheTTL: 60,

    // Enable image optimization

    dangerouslyAllowSVG: true,

    contentDispositionType: 'attachment',

    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

  },



  // Compiler Optimizations

  compiler: {

    // Remove console logs in production

    removeConsole: process.env.NODE_ENV === 'production' ? {

      exclude: ['error', 'warn'],

    } : false,

  },



  // Production Optimizations

  compress: true, // Enable gzip compression

  poweredByHeader: false, // Remove X-Powered-By header for security

 

  // React Strict Mode for better development experience

  reactStrictMode: true,



  // Optimize CSS

  optimizeFonts: true,



  // Enable SWC minification for faster builds

  swcMinify: true,



  // Headers for caching and security

  async headers() {

    return [

      {

        // Apply to all routes

        source: '/:path*',

        headers: [

          {

            key: 'X-DNS-Prefetch-Control',

            value: 'on'

          },

          {

            key: 'X-Frame-Options',

            value: 'SAMEORIGIN'

          },

          {

            key: 'X-Content-Type-Options',

            value: 'nosniff'

          },

          {

            key: 'Referrer-Policy',

            value: 'origin-when-cross-origin'

          },

        ],

      },

      {

        // Cache static assets

        source: '/static/:path*',

        headers: [

          {

            key: 'Cache-Control',

            value: 'public, max-age=31536000, immutable',

          },

        ],

      },

      {

        // Cache images

        source: '/_next/image/:path*',

        headers: [

          {

            key: 'Cache-Control',

            value: 'public, max-age=31536000, immutable',

          },

        ],

      },

      {

        // Cache static files

        source: '/_next/static/:path*',

        headers: [

          {

            key: 'Cache-Control',

            value: 'public, max-age=31536000, immutable',

          },

        ],

      },

    ];

  },



  // Experimental features for better performance

  experimental: {

    // Enable optimistic client cache

    optimisticClientCache: true,

    // Optimize package imports

    optimizePackageImports: ['framer-motion', 'lucide-react'],

  },

};



module.exports = nextConfig;