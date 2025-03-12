'use client'
const eventTypes = [
  { label: 'Meetings', color: 'bg-blue-500' },
  { label: 'Personal', color: 'bg-green-500' },
  { label: 'Reminders', color: 'bg-yellow-500' },
]

export default function EventFilters() {
  return (
    <div className="space-y-2">
      {eventTypes.map((type) => (
        <div key={type.label} className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${type.color}`} />
          <span className="text-sm text-gray-700 dark:text-gray-200">{type.label}</span>
        </div>
      ))}
    </div>
  )
}
