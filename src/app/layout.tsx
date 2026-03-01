import { Inter } from 'next/font/google'
import './globals.css'
import NextAuthProvider from '@/components/providers/AuthProvider'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="description" content="BRANDS YOU LIKE! Discover Pakistan's finest collection of premium footwear. From formal elegance to casual comfort - we've got your perfect match." />
        <meta name="keywords" content="shoes, footwear, B&B Shoes, premium shoes, Pakistan shoes, online shoe store" />
        <meta name="author" content="B&B Shoes" />
        <title>B&B Shoes | Premium Experience</title>
        <meta name="theme-color" content="#0b132b" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="B&B Shoes" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}