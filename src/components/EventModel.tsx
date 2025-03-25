'use client';
import { useEffect, useState, useRef } from 'react';
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

export default function EventModal({
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

  // **Refs for Flatpickr**
  const datePickerRef = useRef<HTMLInputElement>(null);
  const startPickerRef = useRef<HTMLInputElement>(null);
  const endPickerRef = useRef<HTMLInputElement>(null);

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
      if (datePickerRef.current) {
        flatpickr(datePickerRef.current, {
          dateFormat: 'Y-m-d',
          defaultDate: form.date,
          onChange: (selectedDates) => {
            setForm((prev) => ({ ...prev, date: selectedDates[0].toISOString().split('T')[0] }));
          },
        });
      }
      if (startPickerRef.current) {
        flatpickr(startPickerRef.current, {
          enableTime: true,
          noCalendar: true,
          dateFormat: 'H:i',
          defaultDate: form.startTime,
          onChange: (selectedDates) => {
            setForm((prev) => ({ ...prev, startTime: selectedDates[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }));
          },
        });
      }
      if (endPickerRef.current) {
        flatpickr(endPickerRef.current, {
          enableTime: true,
          noCalendar: true,
          dateFormat: 'H:i',
          defaultDate: form.endTime,
          onChange: (selectedDates) => {
            setForm((prev) => ({ ...prev, endTime: selectedDates[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }));
          },
        });
      }
    }
  }, [open]); // Ensures Flatpickr initializes when modal opens

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
          ref={datePickerRef}
          className="w-full border p-2 rounded"
          placeholder="Select Date"
          value={form.date}
          readOnly
          required
        />

        {!form.isAllDay && (
          <>
            <input
              name="startTime"
              ref={startPickerRef}
              className="w-full border p-2 rounded"
              placeholder="Start Time"
              value={form.startTime}
              readOnly
              required
            />
            <input
              name="endTime"
              ref={endPickerRef}
              className="w-full border p-2 rounded"
              placeholder="End Time"
              value={form.endTime}
              readOnly
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
