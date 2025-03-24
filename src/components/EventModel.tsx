// src/components/EventModal.tsx
'use client';

import { useState, useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  editingId: string | null;
  selectedDate: string | null;
  fetchEvents: () => void;
}

const EventModal = ({ open, onClose, editingId, selectedDate, fetchEvents }: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [isAllDay, setIsAllDay] = useState(false);

  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const endTimeRef = useRef<HTMLInputElement | null>(null);

  // Handle selectedDate when creating
  useEffect(() => {
    if (!editingId && selectedDate) {
      setDate(selectedDate);
      setTitle('');
      setStartTime('');
      setEndTime('');
      setIsAllDay(false);
    }
  }, [selectedDate, editingId]);

  // Fetch event details if editing
  useEffect(() => {
    const fetchEvent = async () => {
      if (editingId) {
        try {
          const res = await fetch(`/api/events/${editingId}`);
          const data = await res.json();

          if (res.ok && data?.event) {
            setTitle(data.event.title || '');
            setDate(data.event.date?.substring(0, 10) || '');
            setStartTime(data.event.startTime || '');
            setEndTime(data.event.endTime || '');
            setIsAllDay(data.event.isAllDay || false);
          } else {
            console.error('Error fetching event:', data.error);
          }
        } catch (err) {
          console.error('Fetch error:', err);
        }
      }
    };

    if (open) fetchEvent();
  }, [editingId, open]);

  // Initialize flatpickr for date
  useEffect(() => {
    if (dateInputRef.current) {
      const fp = flatpickr(dateInputRef.current, {
        dateFormat: "Y-m-d",
        defaultDate: date,
        onChange: (dates) => {
          setDate(dates[0].toISOString().split("T")[0]);
        },
      });

      return () => fp.destroy();
    }
  }, [date]);

  useEffect(() => {
    if (startTimeRef.current && !isAllDay) {
      const fpStart = flatpickr(startTimeRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        defaultDate: startTime || undefined,
        onChange: (dates) => {
          setStartTime(dates[0].toISOString().split("T")[1].slice(0, 5));
        },
      });

      return () => fpStart.destroy();
    }
  }, [startTime, isAllDay]);

  useEffect(() => {
    if (endTimeRef.current && !isAllDay) {
      const fpEnd = flatpickr(endTimeRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        defaultDate: endTime || undefined,
        onChange: (dates) => {
          setEndTime(dates[0].toISOString().split("T")[1].slice(0, 5));
        },
      });

      return () => fpEnd.destroy();
    }
  }, [endTime, isAllDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = { title, date, startTime, endTime, isAllDay };

    try {
      if (editingId) {
        await fetch(`/api/events/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      } else {
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      }
      onClose();
      fetchEvents();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async () => {
    if (editingId) {
      try {
        await fetch(`/api/events/${editingId}`, { method: "DELETE" });
        onClose();
        fetchEvents();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          {editingId ? "Edit Event" : "Create Event"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium">Date</label>
            <input
              id="date"
              ref={dateInputRef}
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="isAllDay" className="inline-flex items-center">
              <input
                id="isAllDay"
                type="checkbox"
                checked={isAllDay}
                onChange={() => setIsAllDay(!isAllDay)}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm">All Day Event</span>
            </label>
          </div>

          {!isAllDay && (
            <>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-sm font-medium">Start Time</label>
                <input
                  id="startTime"
                  ref={startTimeRef}
                  type="text"
                  value={startTime || ""}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endTime" className="block text-sm font-medium">End Time</label>
                <input
                  id="endTime"
                  ref={endTimeRef}
                  type="text"
                  value={endTime || ""}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </>
          )}

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              {editingId ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>

        {editingId && (
          <div className="mt-4 text-center">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;
