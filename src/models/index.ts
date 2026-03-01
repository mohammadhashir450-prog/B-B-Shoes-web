import mongoose from 'mongoose';

// Aapka Database URL
const MONGODB_URI = "mongodb+srv://mohammadhashir450_db_user:hashir189@bnbwebs.7lltnpr.mongodb.net/?appName=BnBWebs";

// Global cache system (Taake Next.js bar bar connect na kare)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

if (!cached.promise) {
  cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
    console.log("✅ MongoDB Connected Successfully!");
    return mongoose;
  }).catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });
}

// Export all models
export { default as Product } from './Product';
export { default as User } from './User';
export { default as Order } from './Order';
export { default as Review } from './Review';

// Export interfaces
export type { IProduct } from './Product';
export type { IUser } from './User';
export type { IOrder } from './Order';
export type { IReview } from './Review';