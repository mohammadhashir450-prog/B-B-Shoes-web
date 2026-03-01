import mongoose, { Model, Document } from 'mongoose';
import { NotFoundError } from './errorHandler';
import { logger } from './logger';

// =========================================================
// 1. DATABASE CONNECTION LOGIC (Timeout & IPv4 Fix)
// =========================================================

// MONGODB_URI apka direct link daal diya hai taake .env ka masla na aaye
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadhashir450_db_user:hashir189@bnbwebs.7lltnpr.mongodb.net/?appName=BnBWebs";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // 🔥 ASAL FIX YAHAN HAI 🔥
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000, // Connection ke liye 15 seconds allow karna
      family: 4, // 🔴 ZAROORI: Pakistan mein ISPs/PTCL ke IPv6 timeout issue ko fix karta hai
    };

    console.log("⏳ Connecting to MongoDB...");

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully via dbService!");
      return mongoose;
    }).catch((err) => {
      console.error("❌ MongoDB Connection Error:", err);
      cached.promise = null; // Error aye toh cache reset kare
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
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