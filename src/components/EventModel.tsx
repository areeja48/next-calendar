'use client';

import { useEffect, useState } from 'react';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  editingId: string | null;
  fetchEvents: () => void;
  selectedDate?: string;
}

export default function EventModal({
  open,
  onClose,
  editingId,
  fetchEvents,
  selectedDate,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (editingId) {
      const fetchEventDetails = async () => {
        const res = await fetch(`/api/events/${editingId}`);
        const data = await res.json();
        setTitle(data.title);
        setDate(data.start.split('T')[0]);
        setStartTime(data.start?.split('T')[1]?.slice(0, 5) || '');
        setEndTime(data.end?.split('T')[1]?.slice(0, 5) || '');
      };
      fetchEventDetails();
    } else if (selectedDate) {
      setDate(selectedDate);
    } else {
      setTitle('');
      setDate('');
      setStartTime('');
      setEndTime('');
    }
  }, [editingId, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = `${date}T${startTime}`;
    const end = `${date}T${endTime}`;

    const payload = { title, start, end };

    if (editingId) {
      await fetch(`/api/events/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    onClose();
    fetchEvents();
  };

  const handleDelete = async () => {
    if (editingId) {
      await fetch(`/api/events/${editingId}`, { method: 'DELETE' });
      fetchEvents();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Date</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Start Time</label>
            <input
              type="time"
              className="w-full border px-3 py-2 rounded-md"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">End Time</label>
            <input
              type="time"
              className="w-full border px-3 py-2 rounded-md"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
        {editingId && (
          <div className="mt-4 text-center">
            <button
              onClick={handleDelete}
              className="text-red-600 hover:underline"
            >
              Delete Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
