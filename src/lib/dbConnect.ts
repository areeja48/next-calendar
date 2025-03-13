// lib/dbConnect.ts
import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('⚠️ MONGODB_URI not defined in environment variables');
}

interface MongooseGlobal {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Declare global type to extend NodeJS.Global
declare global {
  let mongoose: MongooseGlobal | undefined;
}

// Initialize global cache if not already
const globalCache: MongooseGlobal = global.mongoose ?? { conn: null, promise: null };

export default async function dbConnect(): Promise<Connection> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'calendar',
      bufferCommands: false,
    }).then(m => m.connection);
  }

  globalCache.conn = await globalCache.promise;
  global.mongoose = globalCache; // Set it to global for reuse in next calls

  console.log('✅ MongoDB connected');
  return globalCache.conn;
}
