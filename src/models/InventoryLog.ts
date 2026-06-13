import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryLog extends Document {
  product: mongoose.Types.ObjectId;
  size: number;
  color?: string;
  quantityChange: number; // positive for addition, negative for deduction
  actionType: 'restock' | 'sale' | 'return' | 'adjustment' | 'damage';
  reason?: string;
  performedBy?: mongoose.Types.ObjectId; // Admin user
  createdAt: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: ['restock', 'sale', 'return', 'adjustment', 'damage'],
    },
    reason: {
      type: String,
      default: '',
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.models.InventoryLog || mongoose.model<IInventoryLog>('InventoryLog', InventoryLogSchema);
