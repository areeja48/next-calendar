'use client';

import { useState } from 'react';

interface CreateEventFormProps {
  onClose: () => void;
  fetchEvents: () => Promise<void>;
}

export default function CreateEventForm({ onClose, fetchEvents }: CreateEventFormProps) {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateEvent = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/google/calendar/create_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary,
          description,
          startTime,
          endTime,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Event created successfully in Google Calendar!');
        setSummary('');
        setDescription('');
        setStartTime('');
        setEndTime('');
        await fetchEvents(); // Refresh events in UI
        onClose(); // Close the form/modal
      } else {
        setMessage(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setMessage('❌ Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-6 w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Create Google Calendar Event
        </h2>

        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />

        <button
          onClick={handleCreateEvent}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>

        {message && <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>}
      </div>
    </div>
  );
}
