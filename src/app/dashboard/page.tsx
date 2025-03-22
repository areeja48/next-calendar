'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FloatingActionButton from '@/components/FAB';
import CalendarWrapper from '@/components/CalendarWrapper';
import EventModel from '@/components/EventModel'; // Ensure correct file name
import SideBar  from '@/components/SideBar';
import CreateEventForm from '@/components/CreateGoogleEvent';
import GoogleCalendarEvents from '@/components/GetGoogleEvent';
// ✅ Updated event type
interface EventData {
  _id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [showGoogleModal, setShowGoogleModal] = useState(false); // ✅ Add this line

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchEvents();
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

  return (
    <div className="flex h-screen overflow-hidden">
     
     <SideBar onAddGoogleEventClick={() => setShowGoogleModal(true)} />
      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col">
    
        {/* Calendar Section */}
        <main className="flex-1 p-6 pt-16 overflow-y-auto">
          <CalendarWrapper
            events={events}
            onEventClick={handleEdit}
            onDateClick={handleDateClick}
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
        
         {/* Show Google Event Form when triggered */}
  {showGoogleModal && (
    <CreateEventForm
      onClose={() => setShowGoogleModal(false)}
      fetchEvents={fetchEvents}
    />
  )}
   
   <div className="p-6">
      <GoogleCalendarEvents />
    </div>
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
