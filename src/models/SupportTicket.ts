import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketMessage {
  sender: mongoose.Types.ObjectId; // User who sent this message
  senderType: 'user' | 'admin';
  message: string;
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  user: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  category: 'order' | 'payment' | 'account' | 'delivery' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  messages: ITicketMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema = new Schema<ITicketMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderType: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['order', 'payment', 'account', 'delivery', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    messages: [TicketMessageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
