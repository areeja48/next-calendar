// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import ClientSessionProvider from '@/components/ClientSessionProvider';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';

export const metadata: Metadata = {
  title: 'Google Calendar Clone',
  description: 'A calendar app with full CRUD and auth',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientSessionProvider>
          <Header />
          <SideBar />
          <div className="pt-16 h-full ml-64">{/* Sidebar width margin */}  
            {children}
          </div>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
