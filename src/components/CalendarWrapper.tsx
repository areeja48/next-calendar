'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

interface EventData {
  _id: string;
  title: string;
  date: string;
  time?: string;
}
interface CalendarWrapperProps {
  events: EventData[];
  onEventClick: (eventId: string) => void;
  fetchEvents: () => Promise<void>; // ✅ Add this line
}

const CalendarWrapper = ({ events, onEventClick }: CalendarWrapperProps) => {
  const formattedEvents = events.map((event) => ({
    title: event.title,
    start: event.date,
    end: event.time ? `${event.date}T${event.time}` : undefined,
    id: event._id,
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
      initialView="dayGridMonth"
      events={formattedEvents}
      eventClick={(info) => onEventClick(info.event.id)}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      }}
    />
  );
};

export default CalendarWrapper;
