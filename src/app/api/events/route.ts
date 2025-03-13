// app/api/events/route.ts
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch user events
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 });
    }

    await dbConnect();
    const events = await Event.find({ userEmail: session.user.email });

    return NextResponse.json(events, { status: 200 });
  } catch (err: unknown) {
    console.error('❌ GET /api/events error:', (err as Error).message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Create new event
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, date } = await req.json();

    if (!title || !date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await dbConnect();
    await Event.create({ title, date, userEmail: session.user.email });

    return NextResponse.json({ message: 'Event created' }, { status: 201 });
  } catch (err: unknown) {
    console.error('❌ POST /api/events error:', (err as Error).message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
