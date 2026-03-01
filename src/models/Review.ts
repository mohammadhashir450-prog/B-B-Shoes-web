import mongoose, { Document, Schema } from 'mongoose';

// Review Interface
export interface IReview extends Document {
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Review Schema
const ReviewSchema = new Schema<IReview>(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      ref: 'Product',
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ customerEmail: 1 });
ReviewSchema.index({ isApproved: 1 });
ReviewSchema.index({ createdAt: -1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
