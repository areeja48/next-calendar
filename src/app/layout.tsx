
import type { Metadata } from 'next'
import ClientSessionProvider from '@/components/ClientSessionProvider'
import "./globals.css"
export const metadata: Metadata = {
  title: 'Google Calendar Clone',
  description: 'A calendar app with full CRUD and auth',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
      <ClientSessionProvider>
     

      <div className="pt-16 h-full"> {/* Add padding-top for the fixed header height */}
        {children}
      </div>
    </ClientSessionProvider>
      
      </body>
    </html>
  )
}
