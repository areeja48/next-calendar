import { google } from 'googleapis';
import { getToken } from 'next-auth/jwt';
import { NextResponse , NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getToken({ req }); 
  // Check if token or access token is missing
  if (!token || !token.accessToken)  {
    return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token.accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(), // fetch upcoming events
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return NextResponse.json({ events: response.data.items });
  } catch (error: unknown) {
    console.error('Error fetching events:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to fetch events: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to fetch events from Google Calendar' }, { status: 500 });
  }
}
