'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import CalendarWrapper from '@/components/CalendarWrapper';
import EventModal from '@/components/EventModel';
import FloatingActionButton from '@/components/FAB';
import { DateClickArg } from '@fullcalendar/interaction';

interface EventData {
  _id: string;
  title: string;
  start: string;
  end?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    if (session) fetchEvents();
  }, [session]);

  const handleCreate = () => {
    setEditingId(null);
    setSelectedDate(undefined);
    setOpen(true);
  };

  const handleEdit = (eventId: string) => {
    setEditingId(eventId);
    setOpen(true);
  };

  const handleDateClick = (info: DateClickArg) => {
    setEditingId(null);
    setSelectedDate(info.dateStr);
    setOpen(true);
  };

  if (status === 'loading') return <div>Loading...</div>;

  if (!session) {
    return (
      <div className="p-6">
        <button onClick={() => signIn()} className="bg-blue-600 text-white px-4 py-2 rounded">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">
          Sign Out
        </button>
      </div>

      <main className="p-4">
        <CalendarWrapper
          events={events}
          onEventClick={handleEdit}
          onDateClick={handleDateClick}
        />
      </main>

      {!open && <FloatingActionButton onClick={handleCreate} />}

      <EventModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
          setSelectedDate(undefined);
        }}
        editingId={editingId}
        selectedDate={selectedDate}
        fetchEvents={fetchEvents}
      />
    </div>
  );
}
