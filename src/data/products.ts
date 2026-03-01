/**
 * ⚠️ DUMMY DATA REMOVED
 * All products are now managed by admin panel
 * Products are stored in localStorage and MongoDB
 * This file is kept only for type exports
 */

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  description: string
  longDescription?: string
  images: string[]
  category: string
  gender: 'men' | 'women' | 'kids' | 'unisex'
  brand: string
  sizes: string[]
  colors: string[]
  stock: number
  featured?: boolean
  isNew?: boolean
  discount?: number
  rating?: number
  reviews?: number
}

export const products: Product[] = []

