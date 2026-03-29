import { Inter, Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'
import NextAuthProvider from '@/components/providers/AuthProvider'
import { CartProvider } from '@/context/CartContext'
import { ProductProvider } from '@/context/ProductContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { Metadata, Viewport } from 'next'

// Fonts ko Next.js standard ke mutabiq load karna (Warnings fix)
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], weight: ['300', '400', '600', '700', '800'], variable: '--font-manrope' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-playfair' })

// Metadata ko naye tareeqe se define karna (SEO Friendly)
export const metadata: Metadata = {
  title: 'B&B Shoes | Premium Experience',
  description: "BRANDS YOU LIKE! Discover Pakistan's finest collection of premium footwear. From formal elegance to casual comfort - we've got your perfect match.",
  keywords: "shoes, footwear, B&B Shoes, premium shoes, Pakistan shoes, online shoe store",
  authors: [{ name: "B&B Shoes" }],
  icons: {
    icon: "/favicon.ico",
  },
}

// Viewport configuration (Next.js 14+ standard)
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