# Environment Variables Setup Guide

## 📝 Files Created

1. **`.env.local`** - Your actual environment variables (DO NOT commit to Git)
2. **`.env.example`** - Example template for team members
3. **`src/lib/env.ts`** - Centralized environment configuration

## 🚀 Usage

### Import environment variables in your code:

```typescript
import { env } from '@/lib/env'

// Database
const dbUrl = env.database.url

// Admin password
const adminPass = env.auth.adminPassword

// Shipping fee
const shippingFee = env.business.shippingFee
```

## 🔧 Future Database Setup

### MongoDB (Recommended)
```bash
npm install mongodb mongoose
```

```typescript
// lib/mongodb.ts
import mongoose from 'mongoose'
import { env } from './env'

export async function connectDB() {
  await mongoose.connect(env.database.mongoUri)
}
```

### PostgreSQL with Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

### MySQL
```bash
npm install mysql2
```

## 💳 Payment Integration

### JazzCash (Pakistan)
```typescript
import { env } from '@/lib/env'

const jazzCashConfig = {
  merchantId: env.jazzCash.merchantId,
  password: env.jazzCash.password,
}
```

### Stripe
```typescript
import Stripe from 'stripe'
import { env } from '@/lib/env'

const stripe = new Stripe(env.stripe.secretKey)
```

## 📧 Email Setup

### SendGrid
```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail'
import { env } from '@/lib/env'

sgMail.setApiKey(env.email.sendgridApiKey)
```

## 📦 File Upload (Cloudinary)

```bash
npm install cloudinary
```

```typescript
import { v2 as cloudinary } from 'cloudinary'
import { env } from '@/lib/env'

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
})
```

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Already in .gitignore ✓
2. **Use different values for production**
3. **Rotate secrets regularly**
4. **Use strong random strings for JWT_SECRET**

## 🌍 Production Deployment

### Vercel
Add environment variables in project settings:
- Settings → Environment Variables

### Other Platforms
Upload `.env.local` content or set via platform dashboard

## 📱 Current Business Settings

- **Shipping Fee**: PKR 200
- **Admin Password**: hashir189
- **Contact**: 0336 167 3742
- **Email**: B&Bshoessupport@gmail.com

All values can be changed in `.env.local` file!
