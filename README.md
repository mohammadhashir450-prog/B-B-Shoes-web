# 👟 ShoeStore - Premium E-commerce Website

A modern, fully-featured shoe store e-commerce website built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

### 🏠 Homepage
- Hero section with animated elements
- Featured products showcase
- Category navigation
- Brand section
- Newsletter subscription

### 🛍️ Product Features
- Product catalog with filtering and sorting
- Category and brand filters
- Price range filter
- Product detail pages with image gallery
- Size and color selection
- Add to cart functionality
- Product ratings and reviews

### 🛒 Shopping Experience
- Shopping cart management
- Quantity adjustment
- Real-time cart updates
- Checkout process
- Order success page
- Cart count indicator in navbar

### 🎨 Design Features
- Modern, responsive design
- Smooth animations with Framer Motion
- Mobile-first approach
- Custom Tailwind CSS theme
- Gradient backgrounds
- Interactive hover effects

### 📱 Additional Pages
- About Us
- Contact Us with form
- Categories overview
- Product search
- User account (placeholder)

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** React Context API
- **Image Optimization:** Next.js Image component

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── cart/              # Shopping cart
│   ├── categories/        # Categories page
│   ├── checkout/          # Checkout flow
│   ├── contact/           # Contact form
│   ├── order-success/     # Order confirmation
│   ├── products/          # Product catalog
│   │   └── [id]/         # Product detail page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── home/             # Homepage components
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── CategorySection.tsx
│   │   ├── BrandSection.tsx
│   │   └── NewsletterSection.tsx
│   └── layout/           # Layout components
│       ├── Navbar.tsx
│       └── Footer.tsx
├── context/              # React Context
│   └── CartContext.tsx   # Cart state management
└── data/                 # Mock data
    └── products.ts       # Product data
```

## 🎯 Key Features Implementation

### Cart Management
- Context API for global state
- Add/remove items
- Quantity updates
- Price calculations
- Persistent across pages

### Product Filtering
- Category filter
- Brand filter
- Price range slider
- Sort by price/rating
- Real-time results

### Responsive Design
- Mobile navigation menu
- Responsive grid layouts
- Touch-friendly interactions
- Optimized images

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:
```typescript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Products
Add/edit products in `src/data/products.ts`

### Animations
Customize animations in `tailwind.config.ts` keyframes section

## 📝 Environment Variables

Create a `.env.local` file for environment variables:
```
NEXT_PUBLIC_API_URL=your_api_url
```

## 🚀 Deployment

Deploy easily on Vercel:
```bash
npm run build
```

Or use the Vercel CLI:
```bash
vercel
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please visit the contact page or reach out through the website.

---

Built with ❤️ using Next.js and Tailwind CSS
