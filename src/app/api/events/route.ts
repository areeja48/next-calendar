import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 });
    }

    await dbConnect();
    const events = await Event.find({ userEmail: session.user.email });

    return NextResponse.json(events);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ GET /api/events error:', errorMsg);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, date } = await req.json();
    await dbConnect();
    await Event.create({ title, date, userEmail: session.user.email });

    return NextResponse.json({ message: 'Event added' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ POST /api/events error:', errorMsg);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
