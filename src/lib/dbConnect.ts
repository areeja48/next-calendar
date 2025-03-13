import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('⚠️ MONGODB_URI is not defined in environment variables');
}

// Define cache interface
interface MongooseGlobalCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Properly type and extend globalThis
declare global {
  // Extending globalThis for cache
  var mongooseCache: MongooseGlobalCache | undefined;
}

// Create cache object (const, not let)
const cached: MongooseGlobalCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

// Assign it to global only once
global.mongooseCache = cached;

export default async function dbConnect(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'calendar',
      bufferCommands: false,
    }).then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
