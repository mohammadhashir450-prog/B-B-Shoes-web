import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  key: string;
  salesEndsAt?: Date | null;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global',
      trim: true,
    },
    salesEndsAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: String,
      default: 'admin-panel',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

SiteSettingsSchema.index({ key: 1 }, { unique: true });

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);