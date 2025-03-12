import { Plus } from 'lucide-react'

export default function FloatingActionButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick} // Trigger modal to create a new event
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all"
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}
