import mongoose, { Document, Schema } from 'mongoose';

export interface IShippingMethod extends Document {
  name: string; // e.g. 'Standard Shipping', 'Express Delivery'
  carrier: string; // e.g. 'TCS', 'Leopards', 'DHL'
  cost: number;
  estimatedDays: string; // e.g. '3-5 Business Days', '1-2 Days'
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingMethodSchema = new Schema<IShippingMethod>(
  {
    name: {
      type: String,
      required: [true, 'Shipping method name is required'],
      trim: true,
    },
    carrier: {
      type: String,
      required: [true, 'Carrier name is required'],
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      min: [0, 'Shipping cost cannot be negative'],
      default: 0,
    },
    estimatedDays: {
      type: String,
      required: [true, 'Estimated delivery days is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ShippingMethod || mongoose.model<IShippingMethod>('ShippingMethod', ShippingMethodSchema);
