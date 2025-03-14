'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import FloatingActionButton from '@/components/FAB';
import CalendarWrapper from '@/components/CalendarWrapper';
import EventModel from '@/components/EventModel';

// ✅ Define a proper event type
interface EventData {
  _id: string;
  title: string;
  date: string;
  time?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data: EventData[] = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    if (session) fetchEvents();
  }, [session]);

  const handleCreate = () => {
    setEditingId(null);
    setSelectedDate(null);
    setOpen(true);
  };

  const handleEdit = (eventId: string) => {
    setEditingId(eventId);
    setSelectedDate(null);
    setOpen(true);
  };

  const handleDateClick = (dateStr: string) => {
    setEditingId(null);
    setSelectedDate(dateStr);
    setOpen(true);
  };

  if (status === 'loading') return <div className="p-6">Loading...</div>;

  {/*if (!session) {
    return (
      <div className="p-6">
        <button
          onClick={() => signIn()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }*/}

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sign Out Button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>

      {/* Calendar */}
      <main className="flex-1 p-6 overflow-y-auto">
        <CalendarWrapper
          events={events}
          onEventClick={handleEdit}
          onDateClick={handleDateClick} // ✅ handle date click
        />
      </main>

      {/* Floating Button for New Event */}
      {!open && <FloatingActionButton onClick={handleCreate} />}

      {/* Event Modal */}
      <EventModel
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
          setSelectedDate(null);
        }}
        editingId={editingId}
        fetchEvents={fetchEvents}
        selectedDate={selectedDate}
      />
    </div>
  );
}
