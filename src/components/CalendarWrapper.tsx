// src/components/CalendarWrapper.tsx
'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import '../app/globals.css';

interface EventData {
  _id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
}

interface CalendarWrapperProps {
  events: EventData[];
  onEventClick: (eventId: string) => void;
  onDateClick: (dateStr: string) => void;
}

const CalendarWrapper = ({ events, onEventClick, onDateClick }: CalendarWrapperProps) => {
  const formattedEvents = events.map((event) => ({
    id: event._id,
    title: event.title,
    start: event.startTime ? `${event.date}T${event.startTime}` : event.date,
    end: event.endTime ? `${event.date}T${event.endTime}` : undefined,
    allDay: !event.startTime && !event.endTime, // 👈 Set allDay only if no startTime/endTime
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={formattedEvents}
      eventClick={(info: EventClickArg) => onEventClick(info.event.id)}
      dateClick={(info: DateClickArg) => onDateClick(info.dateStr)}
      headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next dayGridMonth,listMonth', // 👈 Added more views
      }}
      height="auto"
      selectable={true}
    />
  );
};

export default CalendarWrapper;
