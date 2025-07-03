'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

const publicPaths = ['/login', '/signup'];

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = publicPaths.includes(pathname);
  
  useEffect(() => {
    if (loading) return; // Wait for the auth state to be resolved

    // If user is logged in and tries to access a public-only path (login/signup)
    if (user && isPublicPath) {
      router.push('/');
    }
    
    // If user is not logged in and tries to access a private path
    if (!user && !isPublicPath) {
      router.push('/login');
    }
  }, [user, loading, isPublicPath, router, pathname]);

  // The AuthProvider shows a global loader, so we can just return null 
  // to avoid flashing content during redirection.
  if (loading) return null;
  if (user && isPublicPath) return null;
  if (!user && !isPublicPath) return null;
  
  return <>{children}</>;
}
