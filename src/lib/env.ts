/**
 * Environment Variables Configuration
 * Centralized access to all environment variables
 */

export const env = {
  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || '',
    mongoUri: process.env.MONGODB_URI || '',
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET || '',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
    nextAuthUrl: process.env.NEXTAUTH_URL || '',
    adminPassword: process.env.ADMIN_PASSWORD || 'hashir189',
    sessionSecret: process.env.SESSION_SECRET || '',
  },

  // Email Service
  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    from: process.env.EMAIL_FROM || 'noreply@bbshoes.com',
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },

  // Payment Gateways
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    mode: process.env.PAYPAL_MODE || 'sandbox',
  },

  jazzCash: {
    merchantId: process.env.JAZZCASH_MERCHANT_ID || '',
    password: process.env.JAZZCASH_PASSWORD || '',
    integritySalt: process.env.JAZZCASH_INTEGRITY_SALT || '',
  },

  easyPaisa: {
    storeId: process.env.EASYPAISA_STORE_ID || '',
    apiKey: process.env.EASYPAISA_API_KEY || '',
  },

  // File Storage
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || '',
  },

  // SMS Service
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
  },

  // Shipping & Logistics
  shipping: {
    tcs: {
      apiKey: process.env.TCS_API_KEY || '',
      accountNumber: process.env.TCS_ACCOUNT_NUMBER || '',
    },
    leopards: {
      apiKey: process.env.LEOPARDS_API_KEY || '',
    },
  },

  // Social Login
  social: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    },
  },

  // Business Settings
  business: {
    shippingFee: parseInt(process.env.SHIPPING_FEE || '200'),
    currency: process.env.CURRENCY || 'PKR',
    contactPhone: process.env.CONTACT_PHONE || '03361673742',
    contactEmail: process.env.CONTACT_EMAIL || 'B&Bshoessupport@gmail.com',
  },

  // Development
  dev: {
    debug: process.env.DEBUG === 'true',
  },
}

// Helper function to check if running in production
export const isProduction = env.app.nodeEnv === 'production'

// Helper function to check if running in development
export const isDevelopment = env.app.nodeEnv === 'development'

// Validate required environment variables
export function validateEnv() {
  const required = {
    // Add required env vars here when you start using them
    // Example: 'DATABASE_URL': env.database.url,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing required environment variables: ${missing.join(', ')}`
    )
  }

  return missing.length === 0
}
