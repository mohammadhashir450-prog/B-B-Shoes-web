import mongoose, { Document, Schema } from 'mongoose';

export interface IRefund extends Document {
  order: mongoose.Types.ObjectId;
  payment: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  adminNotes?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema = new Schema<IRefund>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Refund amount cannot be negative'],
    },
    reason: {
      type: String,
      required: [true, 'Refund reason is required'],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected', 'processed'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Refund || mongoose.model<IRefund>('Refund', RefundSchema);
