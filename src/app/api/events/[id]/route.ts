import dbConnect from '@/lib/dbConnect'
import Event from '@/models/Event'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse, type NextRequest } from 'next/server'
import mongoose from 'mongoose'

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, date } = await req.json()

    const id = req.nextUrl.pathname.split('/').pop() || ''
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    await dbConnect()

    await Event.findOneAndUpdate(
      { _id: id, userEmail: session.user.email },
      { title, date }
    )

    return NextResponse.json({ message: 'Event updated successfully' })
  } catch (err) {
    console.error('PUT error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = req.nextUrl.pathname.split('/').pop() || ''
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    await dbConnect()

    await Event.findOneAndDelete({ _id: id, userEmail: session.user.email })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (err) {
    console.error('DELETE error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
