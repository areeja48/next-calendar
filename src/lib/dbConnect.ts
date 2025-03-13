// src/lib/dbConnect.ts
import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('⚠️ MONGODB_URI is not defined in environment variables');
}

interface MongooseGlobal {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Extend globalThis with the custom type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseGlobal | undefined;
}

// 👇 Typecast globalThis for TypeScript awareness
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseGlobal;
};

const globalCache: MongooseGlobal =
  globalWithMongoose.mongoose ?? { conn: null, promise: null };

export default async function dbConnect(): Promise<Connection> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'calendar',
      bufferCommands: false,
    }).then(m => m.connection);
  }

  globalCache.conn = await globalCache.promise;
  globalWithMongoose.mongoose = globalCache;

  console.log('✅ MongoDB connected');
  return globalCache.conn;
}
