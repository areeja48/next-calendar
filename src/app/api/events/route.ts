// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB  from '@/lib/dbConnect';
import  Event from '@/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const events = await Event.find({ userEmail }).sort({ date: 1 });
  return NextResponse.json(events);
}
export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, date, startTime, endTime, isAllDay } = body;

  const newEvent = await Event.create({
    title,
    date,
    startTime,
    endTime,
    isAllDay,
    userEmail,
  });

  return NextResponse.json(newEvent);
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, title, date, startTime, endTime, isAllDay } = body;

  const updatedEvent = await Event.findOneAndUpdate(
    { _id: id, userEmail },
    { title, date, startTime, endTime, isAllDay },
    { new: true }
  );

  return NextResponse.json(updatedEvent);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id } = body;

  await Event.findOneAndDelete({ _id: id, userEmail });

  return NextResponse.json({ success: true });
}
