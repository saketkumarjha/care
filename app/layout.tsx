import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { HospitalAuthProvider } from '@/context/HospitalAuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Caresétu - Healthcare Management System',
  description: 'A comprehensive platform connecting hospitals, doctors, and patients',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HospitalAuthProvider>
          {children}
        </HospitalAuthProvider>
      </body>
    </html>
  );
}