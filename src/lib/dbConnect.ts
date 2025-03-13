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
  // This will add a custom property on globalThis
  // You can still use `let` for assigning later
  interface Global {
    mongooseGlobal?: MongooseGlobal;
  }

  // Correct typing for globalThis
  var mongooseGlobal: MongooseGlobal | undefined;
}

// Use `let` instead of `var`
let globalCache: MongooseGlobal = globalThis.mongooseGlobal ?? {
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
