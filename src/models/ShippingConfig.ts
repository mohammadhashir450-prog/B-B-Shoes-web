import mongoose, { Document, Schema } from 'mongoose';

export interface IShippingConfig extends Document {
  fee: number;           // shipping cost in PKR (0 = free)
  isFree: boolean;       // globally free override
  freeThreshold: number; // orders above this get free shipping (0 = always free)
  label: string;         // display label e.g. "Free" or "PKR 200"
  updatedAt: Date;
}

const ShippingConfigSchema = new Schema<IShippingConfig>(
  {
    fee: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    freeThreshold: {
      type: Number,
      default: 0, // 0 means always free regardless of cart total
      min: 0,
    },
    label: {
      type: String,
      default: 'Free',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ShippingConfig ||
  mongoose.model<IShippingConfig>('ShippingConfig', ShippingConfigSchema);
