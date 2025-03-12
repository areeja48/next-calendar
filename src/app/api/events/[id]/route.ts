import dbConnect from '@/lib/dbConnect'
import Event from '@/models/Event'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, date } = await req.json()
  await dbConnect()
  await Event.findOneAndUpdate({ _id: params.id, userEmail: session.user.email }, { title, date })

  return NextResponse.json({ message: 'Updated' })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  await Event.findOneAndDelete({ _id: params.id, userEmail: session.user.email })

  return NextResponse.json({ message: 'Deleted' })
}
