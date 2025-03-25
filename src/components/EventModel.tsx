'use client';
import { useEffect, useRef, useState } from 'react';
import Flatpickr from 'flatpickr';
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
    date: selectedDate || '',
    startTime: '',
    endTime: '',
    isAllDay: false,
  });

  const datePickerRef = useRef<HTMLInputElement>(null);
  const startTimePickerRef = useRef<HTMLInputElement>(null);
  const endTimePickerRef = useRef<HTMLInputElement>(null);

  // Load event details when editing
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

  // Initialize Flatpickr when the modal opens
  useEffect(() => {
    if (open) {
      if (datePickerRef.current) {
        Flatpickr(datePickerRef.current, {
          dateFormat: 'Y-m-d',
          defaultDate: form.date,
          onChange: (selectedDates) => {
            setForm((prev) => ({
              ...prev,
              date: selectedDates[0].toISOString().split('T')[0],
            }));
          },
        });
      }

      if (startTimePickerRef.current) {
        Flatpickr(startTimePickerRef.current, {
          enableTime: true,
          noCalendar: true,
          dateFormat: 'H:i',
          defaultDate: form.startTime,
          onChange: (selectedDates) => {
            setForm((prev) => ({
              ...prev,
              startTime: selectedDates[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));
          },
        });
      }

      if (endTimePickerRef.current) {
        Flatpickr(endTimePickerRef.current, {
          enableTime: true,
          noCalendar: true,
          dateFormat: 'H:i',
          defaultDate: form.endTime,
          onChange: (selectedDates) => {
            setForm((prev) => ({
              ...prev,
              endTime: selectedDates[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));
          },
        });
      }
    }
  }, [open, form.date, form.startTime, form.endTime]);

  // Update state when input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission (Create/Update Event)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert('Title is required');
      return;
    }

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

  // Handle event deletion
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? 'Edit Event' : 'Add Event'}
        </h2>

        {/* Event Title */}
        <input
          name="title"
          className="w-full border p-2 rounded"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Date Picker */}
        <input
          ref={datePickerRef}
          className="w-full border p-2 rounded"
          placeholder="Select Date"
          readOnly
        />

        {/* Time Pickers */}
        {!form.isAllDay && (
          <>
            <input
              ref={startTimePickerRef}
              className="w-full border p-2 rounded"
              placeholder="Start Time"
              readOnly
            />
            <input
              ref={endTimePickerRef}
              className="w-full border p-2 rounded"
              placeholder="End Time"
              readOnly
            />
          </>
        )}

        {/* All Day Event Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isAllDay"
            checked={form.isAllDay}
            onChange={handleChange}
          />
          <label>All Day Event</label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          {editingId && (
            <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
