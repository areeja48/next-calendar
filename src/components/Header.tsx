'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const Header = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center z-50 fixed top-0 left-0 right-0">
      <div className="flex items-center space-x-3">
        {user?.image && (
          <Image
            src={user.image}
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="text-sm">
          <div className="font-semibold">{user?.name}</div>
          <div className="text-gray-500 dark:text-gray-400">{user?.email}</div>
        </div>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </header>
  );
};

export default Header;
