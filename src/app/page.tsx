'use client'

import { signIn } from 'next-auth/react'


export default function SignInPage() {
return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg text-center max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Sign in to SmartCalendar
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Access your personalized event dashboard
        </p>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
