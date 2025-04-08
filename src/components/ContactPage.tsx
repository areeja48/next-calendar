'use client';  // This is a client component

import { useEffect, useState } from 'react';

// Define the type for a contact
interface Contact {
  _id: string;
  displayName: string;
  emailAddress: string;
}

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts');
        const data = await res.json();

        if (res.ok) {
          setContacts(data.contacts);  // Store the contacts
        } else {
          setError(data.error || 'Failed to fetch contacts');
        }
      } catch (error) {
        setError('Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-700">Loading contacts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Your Google Contacts</h1>
      <ul className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No contacts available.</p>
        ) : (
          contacts.map((contact) => (
            <li
              key={contact._id.toString()}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">{contact.displayName}</h3>
              <p className="text-gray-600">Email: {contact.emailAddress}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ContactsPage;
