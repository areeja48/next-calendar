// src/components/CreateEventForm.tsx
'use client';

import { useState } from 'react';

export default function CreateEventForm() {
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
      } else {
        setMessage(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setMessage('❌ Error creating event');
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Create Google Calendar Event</h2>
      
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        onClick={handleCreateEvent}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}
