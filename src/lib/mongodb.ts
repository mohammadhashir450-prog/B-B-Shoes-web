import mongoose from 'mongoose';

// Globally disable command buffering — fail fast instead of waiting 10s
mongoose.set('bufferCommands', false);

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  'mongodb://127.0.0.1:27017/bnb_shoes';

let isConnecting = false;

type MongoRuntimeInfo = {
  database: string;
  collection: string;
  host: string;
  cluster: string;
};

function inferClusterName(host: string): string {
  if (!host) return 'unknown';
  if (host.includes('mongodb.net')) return host.split('.')[0] || 'atlas';
  if (host === '127.0.0.1' || host === 'localhost') return 'local';
  return host;
}

export function getMongoRuntimeInfo(collection = 'unknown'): MongoRuntimeInfo {
  const host = mongoose.connection.host || 'unknown';
  const database = mongoose.connection.name || mongoose.connection.db?.databaseName || 'unknown';

  return {
    database,
    collection,
    host,
    cluster: inferClusterName(host),
  };
}

async function connectDB() {
  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    // Wait for the in-progress connection
    await new Promise<void>((resolve, reject) => {
      const onConnected = () => { mongoose.connection.off('error', onError); resolve(); };
      const onError = (err: Error) => { mongoose.connection.off('connected', onConnected); reject(err); };
      mongoose.connection.once('connected', onConnected);
      mongoose.connection.once('error', onError);
    });
    return mongoose.connection;
  }

  isConnecting = true;
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    console.log('✅ MongoDB Connected Successfully to:', MONGODB_URI.replace(/:([^@]+)@/, ':***@'));
    return mongoose.connection;
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  } finally {
    isConnecting = false;
  }
}

export default connectDB;
