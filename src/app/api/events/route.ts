import dbConnect from '@/lib/dbConnect'
import Event from '@/models/Event'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json([], { status: 200 })

  await dbConnect()
  const events = await Event.find({ userEmail: session.user.email })
  return NextResponse.json(events)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, date } = await req.json()
  await dbConnect()
  await Event.create({ title, date, userEmail: session.user.email })
  console.log('🔍 Connecting to MongoDB...');
  await dbConnect();
  console.log('✅ MongoDB connected.');
  
  return NextResponse.json({ message: 'Event added' })
}
