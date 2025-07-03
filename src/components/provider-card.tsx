import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Provider } from '@/types';
import Link from 'next/link';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const isValidUrl = provider.image && (provider.image.startsWith('http://') || provider.image.startsWith('https://'));
  
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="relative h-40 w-full mb-4">
          {provider.image && (
            <Image
              src={isValidUrl ? provider.image : 'https://placehold.co/600x400.png'}
              alt={provider.name}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint={provider.aiHint}
            />
          )}
        </div>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-xl">{provider.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">{provider.service}</Badge>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold text-foreground">{provider.rating}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-muted-foreground">{provider.description}</p>
        {provider.location && (
            <div className="flex items-center text-sm text-muted-foreground pt-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{provider.location}</span>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
            <Link href={`/services/${provider.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
