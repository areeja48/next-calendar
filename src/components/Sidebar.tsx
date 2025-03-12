'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

export default function Sidebar() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateChange = (value: Date) => {
    setSelectedDate(value)
    console.log('Selected Date:', value)
  }

  return (
    <aside className="sidebar bg-[var(--background)] text-[var(--foreground)] border-r border-gray-200 dark:border-gray-700 shadow-sm p-4 h-screen w-[280px] flex flex-col gap-6 text-sm">
      {/* Mini Calendar */}
      <div className="mini-calendar rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          locale="en-US"
          className="w-full text-sm"
          tileClassName={({ date, view }) =>
            view === 'month' && date.toDateString() === new Date().toDateString()
              ? 'bg-blue-500 text-white rounded-full'
              : ''
          }
        />
      </div>

      {/* Filters */}
      <div className="filters border-t pt-4 border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-2">
          My Calendars
        </h4>

        <div className="flex items-center gap-2">
          <input type="checkbox" className="accent-blue-500" defaultChecked />
          <span>Work</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" className="accent-red-500" />
          <span>Personal</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" className="accent-green-500" />
          <span>Reminders</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" className="accent-purple-500" />
          <span>Tasks</span>
        </div>
      </div>
    </aside>
  )
}
