'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

interface EventData {
  _id: string;
  title: string;
  start: string;
  end?: string;
}

interface CalendarWrapperProps {
  events: EventData[];
  onEventClick: (eventId: string) => void;
  onDateClick: (dateInfo: DateClickArg) => void;
}

export default function CalendarWrapper({
  events,
  onEventClick,
  onDateClick,
}: CalendarWrapperProps) {
  const formattedEvents = events.map((event) => ({
    title: event.title,
    start: event.start,
    end: event.end,
    id: event._id,
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={formattedEvents}
      eventClick={(info) => onEventClick(info.event.id)}
      dateClick={onDateClick}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      }}
    />
  );
}
