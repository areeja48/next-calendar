'use client';

import { useState, useEffect, useRef } from "react";
import flatpickr from "flatpickr"; // Import flatpickr
import "flatpickr/dist/flatpickr.css"; // Import flatpickr styles

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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const dateInputRef = useRef<HTMLInputElement | null>(null); // Reference for the date input
  const startTimeRef = useRef<HTMLInputElement | null>(null); // Reference for the start time input
  const endTimeRef = useRef<HTMLInputElement | null>(null); // Reference for the end time input

  useEffect(() => {
    if (editingId) {
      const fetchEventDetails = async () => {
        const res = await fetch(`/api/events/${editingId}`);
        const data = await res.json();
        setTitle(data.title);
        setDate(data.date);
        setStartTime(data.startTime || "");
        setEndTime(data.endTime || "");
      };
      fetchEventDetails();
    } else {
      setTitle("");
      setDate(selectedDate || "");
      setStartTime("");
      setEndTime("");
    }
  }, [editingId, selectedDate]);

  useEffect(() => {
    // Initialize flatpickr for the date input (calendar)
    if (dateInputRef.current) {
      const fp = flatpickr(dateInputRef.current, {
        dateFormat: "Y-m-d", // Set the date format
        defaultDate: date,   // Set the initial date value
        onChange: (selectedDates) => {
          setDate(selectedDates[0].toISOString().split("T")[0]); // Update state when a date is picked
        },
      });

      // Cleanup flatpickr on unmount
      return () => fp.destroy();
    }
  }, [date]); // Ensure flatpickr is reset if the date changes

  useEffect(() => {
    // Initialize flatpickr for the start time input (calendar + time picker)
    if (startTimeRef.current) {
      const fpStartTime = flatpickr(startTimeRef.current, {
        enableTime: true, // Enable time picker
        noCalendar: false, // Allow calendar to show up
        dateFormat: "Y-m-d H:i", // Show both date and time in the format
        defaultDate: startTime || undefined, // Set initial start time
        minuteIncrement: 1, // Set minute increments to 1
        onChange: (selectedDates) => {
          setStartTime(selectedDates[0].toISOString()); // Update state with the full date and time
        },
      });

      // Cleanup flatpickr on unmount
      return () => fpStartTime.destroy();
    }
  }, [startTime]); // Ensure flatpickr for start time is reset

  useEffect(() => {
    // Initialize flatpickr for the end time input (calendar + time picker)
    if (endTimeRef.current) {
      const fpEndTime = flatpickr(endTimeRef.current, {
        enableTime: true, // Enable time picker
        noCalendar: false, // Allow calendar to show up
        dateFormat: "Y-m-d H:i", // Show both date and time in the format
        defaultDate: endTime || undefined, // Set initial end time
        minuteIncrement: 1, // Set minute increments to 1
        onChange: (selectedDates) => {
          setEndTime(selectedDates[0].toISOString()); // Update state with the full date and time
        },
      });

      // Cleanup flatpickr on unmount
      return () => fpEndTime.destroy();
    }
  }, [endTime]); // Ensure flatpickr for end time is reset

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = { title, date, startTime, endTime };

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
  };

  const handleDelete = async () => {
    if (editingId) {
      await fetch(`/api/events/${editingId}`, { method: "DELETE" });
      onClose();
      fetchEvents();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{editingId ? "Edit Event" : "Create Event"}</h2>
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
              ref={dateInputRef} // Reference flatpickr here
              type="text" // Keep type as text to use flatpickr
              value={date}
              onChange={(e) => setDate(e.target.value)} // Allow value update
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-medium">Start Time</label>
            <input
              id="startTime"
              ref={startTimeRef} // Reference flatpickr for start time
              type="text" // Change type to text for flatpickr to work
              value={startTime}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-medium">End Time</label>
            <input
              id="endTime"
              ref={endTimeRef} // Reference flatpickr for end time
              type="text" // Change type to text for flatpickr to work
              value={endTime}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
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
