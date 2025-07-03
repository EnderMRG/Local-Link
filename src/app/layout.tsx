import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import { FirebaseWarning } from '@/components/firebase-warning';
import { AuthGuard } from '@/components/auth-guard';

export const metadata: Metadata = {
  title: 'Local Link',
  description: 'Connect with local service providers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased">
        <AuthProvider>
          <FirebaseWarning />
          <AuthGuard>
            {children}
          </AuthGuard>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
