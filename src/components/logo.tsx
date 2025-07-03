import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
       <div className="bg-primary p-2 rounded-md">
         <LinkIcon className="text-primary-foreground h-6 w-6" />
       </div>
      <span className="font-headline text-2xl font-bold text-primary">
        Local Link
      </span>
    </Link>
  );
}
