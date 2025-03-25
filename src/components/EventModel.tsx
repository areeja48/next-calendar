'use client';
import { useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

interface EventModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  editingId: string | null;
  refreshEvents: () => void;
  selectedDate?: string | null;
}

interface EventType {
  _id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
}

export default function EventModel({
  open,
  setOpen,
  editingId,
  refreshEvents,
  selectedDate,
}: EventModalProps) {
  const [form, setForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    isAllDay: false,
  });

  useEffect(() => {
    if (editingId) {
      fetch('/api/events')
        .then((res) => res.json())
        .then((events: EventType[]) => {
          const event = events.find((e) => e._id === editingId);
          if (event) {
            setForm({
              title: event.title,
              date: event.date,
              startTime: event.startTime || '',
              endTime: event.endTime || '',
              isAllDay: event.isAllDay || false,
            });
          }
        });
    } else {
      setForm({
        title: '',
        date: selectedDate || '',
        startTime: '',
        endTime: '',
        isAllDay: false,
      });
    }
  }, [editingId, selectedDate]);

  useEffect(() => {
    if (open) {
      flatpickr('#datePicker', { dateFormat: 'Y-m-d' });
      flatpickr('#startPicker', {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
      });
      flatpickr('#endPicker', {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
      });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = JSON.stringify(editingId ? { ...form, id: editingId } : form);

    await fetch('/api/events', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    setOpen(false);
    refreshEvents();
  };

  const handleDelete = async () => {
    await fetch('/api/events', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId }),
    });
    setOpen(false);
    refreshEvents();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? 'Edit Event' : 'Add Event'}
        </h2>

        <input
          name="title"
          className="w-full border p-2 rounded"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="date"
          id="datePicker"
          className="w-full border p-2 rounded"
          placeholder="Select Date"
          value={form.date}
          onChange={handleChange}
          required
        />

        {!form.isAllDay && (
          <>
            <input
              name="startTime"
              id="startPicker"
              className="w-full border p-2 rounded"
              placeholder="Start Time"
              value={form.startTime}
              onChange={handleChange}
              required
            />
            <input
              name="endTime"
              id="endPicker"
              className="w-full border p-2 rounded"
              placeholder="End Time"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isAllDay"
            checked={form.isAllDay}
            onChange={handleChange}
          />
          All Day
        </label>

        <div className="flex justify-between">
          {editingId && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
