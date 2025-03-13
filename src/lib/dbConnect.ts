// lib/dbConnect.ts
import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('⚠️ MONGODB_URI is not defined in environment variables');
}

// Global cache interface for serverless
interface MongooseGlobal {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Attach to globalThis to avoid multiple connections in serverless
const globalCache: MongooseGlobal = (global as any).mongoose ?? {
  conn: null,
  promise: null,
};

if (!(global as any).mongoose) {
  (global as any).mongoose = globalCache;
}

export default async function dbConnect(): Promise<Connection> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI!, {
      dbName: 'calendar',
      bufferCommands: false,
    }).then(m => m.connection);
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
