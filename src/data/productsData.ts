// This file will be dynamically loaded from localStorage
// Admin can add/edit/delete products which will be reflected here

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  brand: string
  sizes: number[]
  colors: string[]
  description: string
  rating: number
  reviews: number
}

// Default products
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Nike Air Max 270',
    price: 12999,
    originalPrice: 15999,
    discount: 20,
    image: '/shoes/nike-air-max.jpg',
    category: 'Running',
    brand: 'Nike',
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ['Black', 'White', 'Red', 'Blue'],
    description: 'Experience ultimate comfort with Nike Air Max 270. Perfect for running and casual wear.',
    rating: 4.8,
    reviews: 324
  },
  {
    id: '2',
    name: 'Adidas Ultraboost 22',
    price: 14999,
    image: '/shoes/adidas-ultraboost.jpg',
    category: 'Running',
    brand: 'Adidas',
    sizes: [7, 8, 9, 10, 11],
    colors: ['Black', 'White', 'Grey'],
    description: 'Revolutionary energy return with Adidas Ultraboost technology.',
    rating: 4.7,
    reviews: 256
  },
  {
    id: '3',
    name: 'Puma RS-X',
    price: 9999,
    originalPrice: 12999,
    discount: 25,
    image: '/shoes/puma-rsx.jpg',
    category: 'Casual',
    brand: 'Puma',
    sizes: [7, 8, 9, 10, 11],
    colors: ['White', 'Blue', 'Red'],
    description: 'Bold and retro style with modern comfort.',
    rating: 4.5,
    reviews: 189
  },
  {
    id: '4',
    name: 'New Balance 574',
    price: 8999,
    image: '/shoes/nb-574.jpg',
    category: 'Casual',
    brand: 'New Balance',
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ['Grey', 'Navy', 'Green'],
    description: 'Classic comfort meets timeless style.',
    rating: 4.6,
    reviews: 145
  }
]

// Get products from localStorage or use defaults
export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return defaultProducts
  
  const stored = localStorage.getItem('allProducts')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return parsed.length > 0 ? parsed : defaultProducts
    } catch {
      return defaultProducts
    }
  }
  
  // Initialize with defaults
  localStorage.setItem('allProducts', JSON.stringify(defaultProducts))
  return defaultProducts
}

// Save products to localStorage
export const saveProducts = (products: Product[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('allProducts', JSON.stringify(products))
  }
}

export const products = getProducts()
