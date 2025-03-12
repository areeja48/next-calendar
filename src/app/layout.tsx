import './globals.css'
import type { Metadata } from 'next'
import ClientSessionProvider from '@/components/ClientSessionProvider'

export const metadata: Metadata = {
  title: 'Google Calendar Clone',
  description: 'A calendar app with full CRUD and auth',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  )
}
