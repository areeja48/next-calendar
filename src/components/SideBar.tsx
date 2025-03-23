'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, X } from 'lucide-react';

const SideBar = () => {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  ];

  const handleAddGoogleEventClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-64 pt-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            My Calendar
          </h1>

          <nav className="space-y-2 mb-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  pathname === item.href
                    ? 'bg-gray-100 dark:bg-gray-800 font-semibold text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={handleAddGoogleEventClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-all"
          >
            <PlusCircle size={18} />
            Add Event to Google Calendar
          </button>
        </div>
      </aside>

      {/* Optional Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Add Event to Google Calendar
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This is a placeholder modal. You can add your event creation form here.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
