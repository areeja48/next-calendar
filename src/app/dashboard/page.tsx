'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import FloatingActionButton from '@/components/FAB';
import CalendarWrapper from '@/components/CalendarWrapper';
import EventModel from '@/components/EventModel';

// ✅ Define a proper event type instead of using `any`
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
  const [events, setEvents] = useState<EventData[]>([]); // ✅ Correct type here

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data: EventData[] = await res.json(); // ✅ Type your response too
    setEvents(data);
  };

  useEffect(() => {
    if (session) fetchEvents();
  }, [session]);

  const handleCreate = () => {
    setEditingId(null); // Reset the editingId for new event creation
    setOpen(true);
  };

  const handleEdit = (eventId: string) => {
    setEditingId(eventId); // Set editingId for editing an existing event
    setOpen(true);
  };

  if (status === 'loading') return <div className="p-6">Loading...</div>;

  if (!session) {
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
  }

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

      <main className="flex-1 p-20 overflow-y-auto">
        <CalendarWrapper
          events={events}
          onEventClick={handleEdit}
          fetchEvents={fetchEvents}
        />
      </main>

      {!open && <FloatingActionButton onClick={handleCreate} />}

      <EventModel
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
        }}
        editingId={editingId}
        fetchEvents={fetchEvents}
      />
    </div>
  );
}
