// lib/dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('⚠️ MONGODB_URI not defined in environment variables');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'calendar',
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected');
    return cached.conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}
