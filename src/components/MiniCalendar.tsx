'use client'

import { useState } from 'react'
import  Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

export default function MiniCalendar() {
  const [date, setDate] = useState<Date | Date[]>(new Date())

  const handleDateChange = (value: Date | Date[]) => {
    setDate(value)
    console.log('Selected Date:', value)
    // Optional: Trigger calendar filtering or navigation
  }

  return (
    <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900">
      <Calendar
        onChange={handleDateChange}
        value={date}
        locale="en-US"
        className="w-full text-sm"
        tileClassName={({ date, view }) =>
          view === 'month' && date.toDateString() === new Date().toDateString()
            ? 'bg-blue-500 text-white rounded-full'
            : ''
        }
      />
    </div>
  )
}
