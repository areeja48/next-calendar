'use client';

import { useState, useEffect } from "react";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  editingId: string | null;
  fetchEvents: () => void;
}

const EventModal = ({ open, onClose, editingId, fetchEvents }: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  

  // Fetch event details when editing
  useEffect(() => {
    if (editingId) {
      const fetchEventDetails = async () => {
        const res = await fetch(`/api/events/${editingId}`);
        const data = await res.json();
        setTitle(data.title);
        setDate(data.date);
        setTime(data.time || "");
        
      };
      fetchEventDetails();
    } else {
      setTitle("");
      setDate("");
      setTime("");

    }
  }, [editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      title,
      date,
      time,
    };

    // Handle Create or Update based on editingId
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

    onClose(); // Close the modal
    fetchEvents(); // Refresh the events list
  };

  // Delete event
  const handleDelete = async () => {
    if (editingId) {
      await fetch(`/api/events/${editingId}`, {
        method: "DELETE",
      });
      fetchEvents(); // Refresh the events list after deletion
      onClose(); // Close the modal
    }
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <div className="bg-red p-6 rounded-xl w-96 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">{editingId ? "Edit Event" : "Create Event"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                {editingId ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>

          {/* Add a delete button when editing an existing event */}
          {editingId && (
            <div className="mt-4 flex justify-center">
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
    )
  );
};

export default EventModal;
