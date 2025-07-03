
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/auth-context';
import type { User } from 'firebase/auth';

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'All Providers' },
  ];

  const showAuthButtons = !['/login', '/signup'].includes(pathname);

  const getInitials = (user: User | null) => {
    if (!user) return 'U';
    const name = user.displayName;
    if (name) {
      const nameParts = name.split(' ');
      const firstNameInitial = nameParts[0] ? nameParts[0][0] : '';
      const lastNameInitial = nameParts.length > 1 && nameParts[nameParts.length - 1] ? nameParts[nameParts.length - 1][0] : '';
      return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 md:px-8 border-b bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.photoURL ? user.photoURL : undefined} alt="User Avatar" />
                  <AvatarFallback>{getInitials(user)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            showAuthButtons && (
              <div className="flex items-center gap-2">
                  <Button asChild variant="ghost">
                      <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                      <Link href="/signup">Sign Up</Link>
                  </Button>
              </div>
            )
          )}
        </div>
      
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
                <div className="mb-8">
                    <Logo />
                </div>
                <div className="grid gap-6">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                            href={link.href}
                            className={cn(
                            'text-lg font-medium transition-colors hover:text-primary',
                            pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                </div>
                <div className="mt-auto border-t pt-6">
                    {user ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src={user.photoURL ? user.photoURL : undefined} alt="User Avatar" />
                                    <AvatarFallback>{getInitials(user)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm truncate">{user.displayName || user.email}</span>
                            </div>
                            <SheetClose asChild>
                              <Button variant="ghost" onClick={logout} size="icon">
                                  <LogOut className="h-5 w-5 text-destructive" />
                                  <span className="sr-only">Logout</span>
                              </Button>
                            </SheetClose>
                        </div>
                    ) : (
                       showAuthButtons && (
                        <div className="grid gap-2">
                            <SheetClose asChild>
                              <Button asChild className="w-full">
                                  <Link href="/signup">Sign Up</Link>
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button asChild variant="outline" className="w-full">
                                  <Link href="/login">Log In</Link>
                              </Button>
                            </SheetClose>
                        </div>
                       )
                    )}
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
