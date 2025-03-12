// src/app/sign-in/page.tsx
'use client'

import { signInWithGoogle } from '@/lib/auth'

export default function SignInPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl mb-4">Sign in with Google</h1>
      <button
        onClick={signInWithGoogle}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </div>
  )
}
