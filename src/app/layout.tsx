import { Inter, Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'
import NextAuthProvider from '@/components/providers/AuthProvider'
import { CartProvider } from '@/context/CartContext'
import { ProductProvider } from '@/context/ProductContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { Metadata, Viewport } from 'next'

// Fonts ko Next.js standard ke mutabiq load karna
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], weight: ['300', '400', '600', '700', '800'], variable: '--font-manrope' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-playfair' })

// High-Performance SEO Metadata for B&B Shoes
export const metadata: Metadata = {
  metadataBase: new URL('https://bnbshoes.online'),
  title: 'B&B Shoes | Premium Experience',
  description: "BRANDS YOU LIKE! Discover Pakistan's finest collection of premium footwear. From formal elegance to casual comfort - we've got your perfect match.",
  keywords: ["shoes", "footwear", "B&B Shoes", "premium shoes", "Pakistan shoes", "online shoe store", "sneakers", "leather boots"],
  authors: [{ name: "B&B Shoes" }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'B&B Shoes | Premium Experience',
    description: "Discover Pakistan's finest collection of premium footwear. Shop online for the best quality shoes.",
    url: 'https://bnbshoes.online',
    siteName: 'B&B Shoes',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'B&B Shoes Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B&B Shoes | Premium Experience',
    description: "Discover Pakistan's finest collection of premium footwear.",
    images: ['/icon-512.png'],
  },
}

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b132b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${manrope.variable} ${playfair.variable}`}>
        <NextAuthProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}