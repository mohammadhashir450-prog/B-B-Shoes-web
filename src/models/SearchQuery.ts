import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchQuery extends Document {
  query: string;
  count: number;
  resultsCount: number;
  lastSearchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SearchQuerySchema = new Schema<ISearchQuery>(
  {
    query: {
      type: String,
      required: [true, 'Query string is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    count: {
      type: Number,
      default: 1,
      min: [1, 'Count must be at least 1'],
    },
    resultsCount: {
      type: Number,
      default: 0,
      min: [0, 'Results count cannot be negative'],
    },
    lastSearchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SearchQuery || mongoose.model<ISearchQuery>('SearchQuery', SearchQuerySchema);
