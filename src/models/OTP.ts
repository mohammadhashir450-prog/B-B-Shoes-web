import mongoose, { Schema, Document } from 'mongoose';

// OTP Interface
interface IOTP extends Document {
  email: string;
  otp: string;
  purpose: 'login' | 'register' | 'password-reset';
  verified: boolean;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// OTP Schema
const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['login', 'register', 'password-reset'],
      default: 'login',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic deletion of expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster lookups
otpSchema.index({ email: 1, purpose: 1 });

const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', otpSchema);

export default OTP;
