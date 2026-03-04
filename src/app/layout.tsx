import { Inter, Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'
import NextAuthProvider from '@/components/providers/AuthProvider'
import { CartProvider } from '@/context/CartContext'
import { ProductProvider } from '@/context/ProductContext'
import { Metadata } from 'next'

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
  themeColor: "#0b132b",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols ko hum abhi bhi link se rakh sakte hain ya skip kar sakte hain agar use nahi ho raha */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} ${manrope.variable} ${playfair.variable}`}>
        <NextAuthProvider>
          <ProductProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}