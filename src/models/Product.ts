import mongoose, { Document, Schema } from 'mongoose';

// Product Interface
export interface IProduct extends Document {
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  sizeColorImages?: Array<{
    size: number;
    color: string;
    image: string;
  }>;
  category: string;
  subcategory?: string;  // Added subcategory field
  brand: string;
  sizes: number[];
  colors: string[];
  description: string;
  rating: number;
  reviews: number;
  isOnSale: boolean;
  isNewArrival: boolean;
  inStock: boolean;
  stock: number;
  sold: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    sizeColorImages: [
      {
        size: Number,
        color: String,
        image: String,
      },
    ],
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Men',
        'Women',
        'Kids',
        'Running',
        'Basketball',
        'Training',
        'Formal',
        'Casual',
        'Sports',
        'Oxford',
        'Loafers',
        'Boots',
        'Slippers',
        'Sneakers',
      ],
    },
    subcategory: {
      type: String,
      enum: ['Sneakers', 'Basketball', 'Formal', 'Running', 'Oxford', 'Loafers', 'Boots', 'Slippers', 'Peshawari Chappal', ''],
      default: '',
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },
    sizes: {
      type: [Number],
      required: [true, 'At least one size is required'],
    },
    colors: {
      type: [String],
      required: [true, 'At least one color is required'],
    },
    description: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, 'Reviews cannot be negative'],
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, 'Sold count cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ isOnSale: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
