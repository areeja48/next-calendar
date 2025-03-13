// lib/dbConnect.ts
import mongoose, { Connection } from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('⚠️ MONGODB_URI is not defined in environment variables');
}

// Define global cache interface
interface MongooseGlobal {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Extend globalThis with mongoose property
declare global {
  // Allow this file to be compiled as a module
  // without affecting other files
  var mongooseGlobal: MongooseGlobal | undefined;
}

const globalCache: MongooseGlobal = globalThis.mongooseGlobal ?? {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseGlobal) {
  globalThis.mongooseGlobal = globalCache;
}

export default async function dbConnect(): Promise<Connection> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'calendar',
      bufferCommands: false,
    }).then((m) => m.connection);
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
