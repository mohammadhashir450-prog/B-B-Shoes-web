import mongoose, { Document, Schema } from 'mongoose';

// Order Interface
export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    size: number;
    color: string;
    price: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'stripe' | 'paypal';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
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
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    customerAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        productImage: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 200,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'jazzcash', 'easypaisa', 'stripe', 'paypal'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
