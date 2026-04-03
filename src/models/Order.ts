import mongoose, { Document, Schema } from 'mongoose';

// Order Interface
export interface IOrder extends Document {
  orderId: string;
  user_id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'bank' | 'jazzcash' | 'card' | 'easypaisa' | 'stripe' | 'paypal';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentDetails?: {
    cod?: {
      name?: string;
      phone?: string;
      address?: string;
      city?: string;
    };
    jazzcash?: {
      senderNumber?: string;
      transactionId?: string;
      receiverNumber?: string;
      receiverName?: string;
    };
    bank?: {
      bankName?: string;
      senderAccountNumber?: string;
      transactionId?: string;
    };
    card?: {
      cardHolderName?: string;
      cardBrand?: string;
      cardLast4?: string;
      cardMasked?: string;
      expiryMonth?: string;
      expiryYear?: string;
      transactionId?: string;
    };
  };
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
    user_id: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
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
          type: String,
          required: true,
          default: 'N/A',
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
      enum: ['cod', 'bank', 'jazzcash', 'card', 'easypaisa', 'stripe', 'paypal'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDetails: {
      cod: {
        name: { type: String, trim: true },
        phone: { type: String, trim: true },
        address: { type: String, trim: true },
        city: { type: String, trim: true },
      },
      jazzcash: {
        senderNumber: { type: String, trim: true },
        transactionId: { type: String, trim: true },
        receiverNumber: { type: String, trim: true },
        receiverName: { type: String, trim: true },
      },
      bank: {
        bankName: { type: String, trim: true },
        senderAccountNumber: { type: String, trim: true },
        transactionId: { type: String, trim: true },
      },
      card: {
        cardHolderName: { type: String, trim: true },
        cardBrand: { type: String, trim: true },
        cardLast4: { type: String, trim: true },
        cardMasked: { type: String, trim: true },
        expiryMonth: { type: String, trim: true },
        expiryYear: { type: String, trim: true },
        transactionId: { type: String, trim: true },
      },
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
OrderSchema.index({ user_id: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// In dev hot-reload, an older cached model may not include newly added fields.
const existingOrderModel = mongoose.models.Order as mongoose.Model<IOrder> | undefined;
if (existingOrderModel && (!existingOrderModel.schema.path('user_id') || !existingOrderModel.schema.path('paymentDetails'))) {
  mongoose.deleteModel('Order');
}

export default (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
