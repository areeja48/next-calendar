// src/app/api/google/calendar/create_event/route.ts
import { google } from 'googleapis';


import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 });
  }

  const body = await req.json();
  const { summary, description, startTime, endTime } = body;

  // Debug logs
  console.log('Received startTime:', startTime);
  console.log('Received endTime:', endTime);

  // Validate required fields
  if (!summary || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Convert to Date objects
  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    return NextResponse.json({ error: 'Invalid date or time format' }, { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary,
        description,
        start: { dateTime: startDateTime.toISOString() },
        end: { dateTime: endDateTime.toISOString() },
      },
    });

    return NextResponse.json({ message: 'Event created successfully', event: response.data });
  } catch (error: unknown) {
    console.error('Error inserting event:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to create event: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to create event in Google Calendar' }, { status: 500 });
  }
}
