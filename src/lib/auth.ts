// src/lib/auth.ts
import GoogleProvider from 'next-auth/providers/google'
import type { AuthOptions } from 'next-auth'
import { signIn } from 'next-auth/react'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/dashboard',
    signOut: '/', // send unauthenticated users here
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.name = user.name || user.email?.split('@')[0] || ''
        token.email = user.email || ''
        token.role = 'user'
      }

      if (trigger === 'update' && session?.user?.name) {
        token.name = session.user.name
      }

      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
      }
      return session
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`
    },
  },
}

// Optional helper function if you want to use a wrapper:
export const signInWithGoogle = async () => {
  await signIn('google')
}
