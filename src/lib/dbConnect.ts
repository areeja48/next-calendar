import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local')

// Properly typed global mongoose cache
interface MongooseGlobal {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: MongooseGlobal
}

const cached: MongooseGlobal = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  globalWithMongoose.mongoose = cached // assign the cache globally

  return cached.conn
}

export default dbConnect
