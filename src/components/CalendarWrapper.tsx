'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

interface CalendarWrapperProps {
  events: any[]; // Adjust this type based on your event data
  onEventClick: (eventId: string) => void;
  fetchEvents: () => void;
}

const CalendarWrapper = ({ events, onEventClick, fetchEvents }: CalendarWrapperProps) => {
  const formattedEvents = events.map(event => ({
    title: event.title,
    start: event.date, // or adjust based on your event object structure
    end: event.time ? `${event.date}T${event.time}` : undefined, // Handling time if exists
    id: event._id, // Assuming MongoDB ObjectId or another unique identifier
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
      initialView="dayGridMonth"
      events={formattedEvents} // Pass the formatted events to FullCalendar
      eventClick={(info) => onEventClick(info.event.id)} // Handle event click
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      }}
    />
  );
};

export default CalendarWrapper;
