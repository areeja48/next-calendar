// src/app/api/events/route.ts

import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Session start');
    const session = await getServerSession(authOptions);
    console.log('✅ Session:', session);

    if (!session?.user?.email) {
      console.log('❌ No session user email');
      return NextResponse.json([], { status: 200 });
    }

    console.log('🔗 Connecting to DB');
    await dbConnect();
    console.log('✅ DB Connected');

    const events = await Event.find({ userEmail: session.user.email });
    console.log('✅ Events fetched:', events.length);

    return NextResponse.json(events);
  } catch (err: any) {
    console.error('❌ GET /api/events error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// 👇 You were likely missing this second block completely or cut it off mid-edit
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
  } catch (err: any) {
    console.error('❌ POST /api/events error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
