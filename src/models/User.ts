import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider?: string;
  role?: 'user' | 'admin';
  isAdmin?: boolean;
  phone?: string;
  address?: string;
  wishlist?: string[];
  cart?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    user_id: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
      default: () => `USR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      default: 'credentials',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    wishlist: [{
      type: String,
    }],
    cart: [{
      type: Schema.Types.Mixed,
    }],
  },
  {
    timestamps: true,
  }
);

// In dev hot-reload, an older cached model may not include new schema fields.
const existingUserModel = mongoose.models.User as Model<IUser> | undefined;
if (existingUserModel && !existingUserModel.schema.path('user_id')) {
  mongoose.deleteModel('User');
}

const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;
