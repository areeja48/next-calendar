'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FloatingActionButton from '@/components/FAB';
import CalendarWrapper from '@/components/CalendarWrapper';
import EventModal from '@/components/EventModel'; 


interface EventData {
  _id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
}

interface GoogleEvents {
  _id: string;
  title: string;
  start: string;  // Start time as string (in ISO format)
  end: string;    // End time as string (in ISO format)
  allDay: boolean; // Flag for all-day event
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [googleEvents, setGoogleEvents] = useState<GoogleEvents[]>([]);
 
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchGoogleEvents = async () => {
    try {
      const res = await fetch('/api/google/calendar/get_event');
      const data = await res.json();
      setGoogleEvents(data.events || []);  // Ensure data structure matches
    } catch (error) {
      console.error('Error fetching Google events:', error);
    }
  };

  
  useEffect(() => {
    if (session) {
      fetchEvents();
      fetchGoogleEvents();
    }
  }, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center text-gray-700 dark:text-white">
        Loading dashboard...
      </div>
    );
  }

  

  // Pass both events and googleEvents to CalendarWrapper
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="ml-64 flex-1 flex flex-col">
        <main className="flex-1 p-6 pt-16 overflow-y-auto">
          <CalendarWrapper
            events={events}  // Pass events from database
            googleEvents={googleEvents}  // Pass events from Google Calendar
            onEventClick={handleEdit}
            onDateClick={handleDateClick}
          />
        </main>

        {/* Floating Action Button */}
        {!open && <FloatingActionButton onClick={handleCreate} />}

        {/* Event Modal */}
        <EventModal
          open={open}
          setOpen={setOpen}
          editingId={editingId}
          selectedDate={selectedDate}
          refreshEvents={fetchEvents}
        />
      </div>
    </div>
  );
  
  // Handlers
  function handleCreate() {
    setEditingId(null);
    setSelectedDate(null);
    setOpen(true);
  }

  function handleEdit(eventId: string) {
    setEditingId(eventId);
    setSelectedDate(null);
    setOpen(true);
  }

  function handleDateClick(dateStr: string) {
    setEditingId(null);
    setSelectedDate(dateStr);
    setOpen(true);
  }
}

