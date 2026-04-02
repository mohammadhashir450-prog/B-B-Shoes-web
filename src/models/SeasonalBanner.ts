import mongoose, { Document, Schema } from 'mongoose';

export interface ISeasonalBanner extends Document {
  season: 'Summer' | 'Winter' | 'Spring' | 'Fall';
  title: string;
  description?: string;
  bannerImage: string;
  linkUrl?: string;
  discountPercent?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const SeasonalBannerSchema = new Schema<ISeasonalBanner>(
  {
    season: {
      type: String,
      enum: ['Summer', 'Winter', 'Spring', 'Fall'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    bannerImage: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
      trim: true,
      default: '/collections',
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

SeasonalBannerSchema.index({ season: 1, isActive: 1 });
SeasonalBannerSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.SeasonalBanner || mongoose.model<ISeasonalBanner>('SeasonalBanner', SeasonalBannerSchema);
