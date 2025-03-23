// src/app/api/google/calendar/create_event/route.ts

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  // Get token from cookies (App Router style)
  const token = await getToken({ req });

  // Check if token or access token is missing
  if (!token || !token.accessToken) {
    return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 });
  }

  const body = await req.json();
  const { summary, description, startTime, endTime } = body;

  console.log('Received startTime:', startTime);
  console.log('Received endTime:', endTime);

  // Validate input
  if (!summary || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    return NextResponse.json({ error: 'Invalid date or time format' }, { status: 400 });
  }

  try {
    // Setup Google Auth
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: token.accessToken as string,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startDateTime.toISOString(),
        },
        end: {
          dateTime: endDateTime.toISOString(),
        },
      },
    });

    return NextResponse.json({
      message: 'Event created successfully',
      event: response.data,
    });
  } catch (error: unknown) {
    console.error('Error inserting event:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to create event: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to create event in Google Calendar' }, { status: 500 });
  }
}
