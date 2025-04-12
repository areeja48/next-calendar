'use client';

import { useEffect, useState } from 'react';

interface Contact {
  displayName: string;
  emailAddress: string;
  phoneNumber: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts');

        if (!res.ok) {
          const message = await res.text();
          throw new Error(`Error ${res.status}: ${message}`);
        }

        const data = await res.json();
        console.log('Synced contacts:', data.contacts);

        setContacts(data.contacts || []);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Syncing and loading contacts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Synced Google Contacts</h1>
      {contacts.length === 0 ? (
        <p className="text-center text-gray-500">No contacts found.</p>
      ) : (
        <ul className="space-y-4">
          {contacts.map((contact, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition"
            >
              <h2 className="text-lg font-medium text-gray-800">
                {contact.displayName || 'Unnamed Contact'}
              </h2>
              <p className="text-gray-600">{contact.emailAddress || 'No email available'}</p>
              <p className="text-gray-600">{contact.phoneNumber || 'No phone available'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
