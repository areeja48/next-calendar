import dbConnect from '@/lib/dbConnect'
import Event from '@/models/Event'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const events = await Event.find({ userEmail: session.user.email }).sort({ date: 1 })
    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, date, time } = await req.json()
    await dbConnect()

    const newEvent = await Event.create({
      title,
      date,
      time,
      userEmail: session.user.email,
    })

    return NextResponse.json({ message: 'Event created successfully', event: newEvent }, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
