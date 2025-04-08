import React, { useEffect, useState } from 'react';

interface Contact {
  displayName: string;
  emailAddress: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
   
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts');  
        
        if (!res.ok) {
          throw new Error('Failed to fetch contacts');
        }

        const data = await res.json();
        console.log('Fetched contacts data:', data); 

        setContacts(data.contacts || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch contacts');
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
      <h1 className="text-3xl font-semibold text-center mb-4">Your Contacts</h1>
      {contacts.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No contacts found.</p>
      ) : (
        <ul className="space-y-4">
          {contacts.map((contact, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {/* Access the display name directly */}
                {contact.displayName || 'Unnamed Contact'}
              </h3>
              <p className="text-gray-600">
                {/* Access the email directly */}
                {contact.emailAddress || 'No email available'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Contacts;
