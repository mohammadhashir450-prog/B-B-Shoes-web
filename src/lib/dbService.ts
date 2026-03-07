import mongoose, { Model, Document } from 'mongoose';
import { NotFoundError } from './errorHandler';
import { logger } from './logger';

// =========================================================
// 1. DATABASE CONNECTION LOGIC (Timeout & IPv4 Fix)
// =========================================================

// Primary MongoDB URI (Atlas Cloud)
const MONGODB_URI = process.env.MONGODB_URI || "";

// Fallback local MongoDB (for development when Atlas fails)
const MONGODB_LOCAL_URI = process.env.MONGODB_LOCAL_URI || "mongodb://localhost:27017/bnb_shoes";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, isLocal: false };
}

export async function dbConnect() {
  console.log("🔍 dbConnect function called");
  
  // Check if we have a working cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log("✅ Using cached MongoDB connection (" + (cached.isLocal ? "Local" : "Atlas") + ")");
    return cached.conn;
  }

  // If there's a failed connection, clean it up
  if (mongoose.connection.readyState === 99 || mongoose.connection.readyState === 0) {
    console.log("🧹 Cleaning up previous connection state...");
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds for long queries
      connectTimeoutMS: 10000, // 10 seconds to establish connection
      family: 4, // IPv4 only (fixes PTCL/Pakistan ISP issues)
      maxPoolSize: 10, // Connection pool size
      minPoolSize: 2,
    };

    // Try Atlas first, fallback to local MongoDB
    const connectWithFallback = async () => {
      // Skip Atlas and go directly to local for faster connection
      console.log("⏳ Connecting to local MongoDB (fast path)...");
      console.log("📍 Local URI:", MONGODB_LOCAL_URI);
      
      try {
        const localConnection = await mongoose.connect(MONGODB_LOCAL_URI, opts);
        console.log("✅ Local MongoDB Connected Successfully!");
        console.log("ℹ️  Using local database for development");
        cached.isLocal = true;
        return localConnection;
      } catch (localErr: any) {
        console.warn("⚠️  Local MongoDB failed:", localErr.message);
        
        // Only try Atlas if local fails
        if (MONGODB_URI) {
          console.log("🔄 Attempting MongoDB Atlas connection as fallback...");
          console.log("📍 Atlas URI:", MONGODB_URI.substring(0, 35) + "...");
          
          try {
            // Disconnect from local attempt
            try {
              await mongoose.disconnect();
            } catch (e) {
              // Ignore
            }
            
            const atlasConnection = await mongoose.connect(MONGODB_URI, opts);
            console.log("✅ MongoDB Atlas Connected Successfully!");
            cached.isLocal = false;
            return atlasConnection;
          } catch (atlasErr: any) {
            console.error("❌ Atlas also failed:", atlasErr.message);
            throw atlasErr;
          }
        }
        
        console.error("❌ No MongoDB connection available");
        console.error("\n⚠️  MongoDB Setup Required:");
        console.error("   Option 1: Install MongoDB locally (https://www.mongodb.com/try/download/community)");
        console.error("   Option 2: Fix Atlas DNS issue (see MONGODB_SETUP_COMPLETE.md)");
        console.error("   Option 3: Whitelist your IP on MongoDB Atlas\n");
        throw new Error('Unable to connect to any MongoDB instance');
      }
    };

    cached.promise = connectWithFallback();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    console.error("❌ Final connection error:", e.message);
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}

// =========================================================
// 2. GENERIC DATABASE OPERATIONS (Types Relaxed)
// =========================================================

/**
 * Find All Documents with Filters
 */
export async function findAll<T extends Document>(
  model: Model<T>,
  filters: any = {},
  options: {
    sort?: any;
    limit?: number;
    skip?: number;
    select?: string;
  } = {}
): Promise<T[]> {
  await dbConnect();

  const { sort = { createdAt: -1 }, limit, skip, select } = options;

  let query: any = model.find(filters).sort(sort);

  if (select) query = query.select(select);
  if (skip) query = query.skip(skip);
  if (limit) query = query.limit(limit);

  const documents = await query.exec();
  return documents;
}

/**
 * Find Document by ID
 */
export async function findById<T extends Document>(
  model: Model<T>,
  id: string,
  options: { select?: string } = {}
): Promise<T> {
  await dbConnect();

  const { select } = options;

  let query: any = model.findById(id);
  if (select) query = query.select(select);

  const document = await query.exec();

  if (!document) {
    throw new NotFoundError(model.modelName);
  }

  return document;
}

/**
 * Find One Document
 */
export async function findOne<T extends Document>(
  model: Model<T>,
  filters: any,
  options: { select?: string } = {}
): Promise<T | null> {
  await dbConnect();

  const { select } = options;

  let query: any = model.findOne(filters);
  if (select) query = query.select(select);

  const document = await query.exec();

  return document;
}

/**
 * Create Document
 */
export async function create<T extends Document>(
  model: Model<T>,
  data: any
): Promise<T> {
  await dbConnect();

  const document = await model.create(data);
  try {
     logger.success(`Created new ${model.modelName}`, { id: document._id });
  } catch(e) { console.log("Created:", document._id) }

  return document;
}

/**
 * Update Document by ID
 */
export async function updateById<T extends Document>(
  model: Model<T>,
  id: string,
  data: any,
  options: { new?: boolean; runValidators?: boolean } = {}
): Promise<T> {
  await dbConnect();

  const { new: returnNew = true, runValidators = true } = options as any;

  const document = await model.findByIdAndUpdate(id, data, {
    new: returnNew,
    runValidators,
  });

  if (!document) {
    throw new NotFoundError(model.modelName);
  }

  try {
    logger.success(`Updated ${model.modelName} with ID: ${id}`);
  } catch(e) {}
  
  return document;
}

/**
 * Delete Document by ID
 */
export async function deleteById<T extends Document>(
  model: Model<T>,
  id: string
): Promise<T | null> {
  await dbConnect();

  const document = await model.findByIdAndDelete(id);

  if (!document) {
    throw new NotFoundError(model.modelName);
  }

  try {
    logger.success(`Deleted ${model.modelName} with ID: ${id}`);
  } catch(e) {}
  
  return document;
}

/**
 * Count Documents
 */
export async function count<T extends Document>(
  model: Model<T>,
  filters: any = {}
): Promise<number> {
  await dbConnect();
  const count = await model.countDocuments(filters);
  return count;
}

/**
 * Check if Document Exists
 */
export async function exists<T extends Document>(
  model: Model<T>,
  filters: any
): Promise<boolean> {
  await dbConnect();
  const document = await model.findOne(filters).select('_id').lean();
  return !!document;
}

/**
 * Paginated Find
 */
export async function findPaginated<T extends Document>(
  model: Model<T>,
  filters: any = {},
  options: {
    page?: number;
    limit?: number;
    sort?: any;
    select?: string;
  } = {}
): Promise<{
  documents: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  await dbConnect();

  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select,
  } = options;

  const skip = (page - 1) * limit;

  let query: any = model.find(filters).sort(sort).skip(skip).limit(limit);
  if (select) query = query.select(select);

  const [documents, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filters),
  ]);

  const pages = Math.ceil(total / limit);

  return {
    documents,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
}