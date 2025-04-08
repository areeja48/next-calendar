'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import '../app/globals.css';

export interface EventData {
  _id: string;
  title: string;
  date: string; // Local events date (yyyy-mm-dd)
  startTime?: string;
  endTime?: string;
}

export interface GoogleEvents {
  _id: string;
  title: string;
  start: string | { dateTime: string; timeZone: string };  // Start can be a string or an object with dateTime and timeZone
  end: string | { dateTime: string; timeZone: string };    // End can be a string or an object with dateTime and timeZone
  allDay: boolean; // Flag for all-day event
}

interface CalendarWrapperProps {
  events: EventData[];  // Local events
  googleEvents: GoogleEvents[];  // Google events
  onEventClick: (eventId: string) => void;
  onDateClick: (dateStr: string) => void;
}

const CalendarWrapper = ({ events = [], googleEvents = [], onEventClick, onDateClick }: CalendarWrapperProps) => {
  // Format local events
  const formattedEvents = events.map((event) => ({
    id: event._id,
    title: event.title,
    start: event.startTime ? `${event.date}T${event.startTime}` : event.date, // Use date + time or just date
    end: event.endTime ? `${event.date}T${event.endTime}` : undefined, // Use date + time or undefined
    allDay: !event.startTime && !event.endTime, // Mark as allDay if no startTime or endTime
  }));

  // Format Google events (flatten start and end)
  const googleEvent = googleEvents.map((event) => {
    // Ensure start and end are in string format (flatten dateTime if necessary)
    const start = typeof event.start === 'string' ? event.start : event.start.dateTime;
    const end = typeof event.end === 'string' ? event.end : event.end.dateTime;

    return {
      id: event._id,
      title: event.title,
      start: start,  // Use dateTime if it's an object
      end: end,      // Use dateTime if it's an object
      allDay: event.allDay,
    };
  });

  // Combine formatted local and Google events
  const allEvents = [...formattedEvents, ...googleEvent];

  // Log the combined events to check the structure
  console.log("Combined Events:", allEvents);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={allEvents}  // Pass the combined events array to FullCalendar
      eventClick={(info: EventClickArg) => onEventClick(info.event.id)} // Handle event click
      dateClick={(info: DateClickArg) => onDateClick(info.dateStr)} // Handle date click
      headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next dayGridMonth,listMonth', // Add additional views if needed
      }}
      height="auto"
      selectable={true}  // Allow selecting events
    />
  );
};

export default CalendarWrapper;
