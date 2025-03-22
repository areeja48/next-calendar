'use client';
import { useEffect, useState } from 'react';

export default function GoogleCalendarEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/google/calendar/get_event');
        const data = await res.json();
        if (res.ok) {
          setEvents(data.events);
        } else {
          setError(data.error || 'Failed to fetch events');
        }
      } catch (err) {
        setError('Error fetching events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="p-4">Loading events...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Google Calendar Events</h2>
      <ul className="space-y-2">
        {events.map((event: any) => (
          <li key={event.id} className="border p-2 rounded bg-gray-100">
            <strong>{event.summary}</strong>
            <div className="text-sm text-gray-600">
              {event.start?.dateTime
                ? new Date(event.start.dateTime).toLocaleString()
                : event.start?.date}
              {' '} → {' '}
              {event.end?.dateTime
                ? new Date(event.end.dateTime).toLocaleString()
                : event.end?.date}
            </div>
            {event.description && <p className="text-sm">{event.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
