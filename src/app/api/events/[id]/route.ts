import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse, type NextRequest } from 'next/server';

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;
    const { title, date } = await req.json();

    await dbConnect();

    await Event.findOneAndUpdate(
      { _id: id, userEmail: session.user.email },
      { title, date }
    );

    return NextResponse.json({ message: 'Event updated successfully' });
  } catch (err) {
    console.error('PUT error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;

    await dbConnect();

    await Event.findOneAndDelete({ _id: id, userEmail: session.user.email });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
