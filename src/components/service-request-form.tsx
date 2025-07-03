'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2 } from 'lucide-react';
import { suggestProviders } from '@/ai/flows/suggest-providers';
import { useToast } from '@/hooks/use-toast';
import type { Provider } from '@/types';
import { ProviderCard } from './provider-card';

export function ServiceRequestForm() {
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<Provider[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (newDescription.trim().length > 15) {
      timeoutRef.current = setTimeout(() => {
        startTransition(async () => {
          try {
            const result = await suggestProviders({ requestDescription: newDescription });
            setSuggestions(result.suggestedProviders);
          } catch (error) {
            console.error('Error fetching suggestions:', error);
            toast({
              title: "AI Suggestion Error",
              description: "Could not fetch provider suggestions. Please try again.",
              variant: "destructive",
            });
            setSuggestions([]);
          }
        });
      }, 1000); // 1-second debounce
    } else {
      setSuggestions([]);
    }
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Wand2 className="text-accent" />
          What service do you need?
        </CardTitle>
        <CardDescription>Describe your request and we'll suggest providers.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="e.g., My kitchen sink is clogged and I need a plumber to fix the leaky faucet..."
              rows={8}
              value={description}
              onChange={handleDescriptionChange}
              className="min-h-[200px] md:min-h-0"
            />
            <Button size="lg" disabled={!description.trim() || isPending} className="w-full">
              Post Service Request
            </Button>
          </div>

          <div className="space-y-2 h-full flex flex-col">
            <h3 className="text-sm font-medium text-muted-foreground">AI-Powered Suggestions</h3>
            <div className="flex-grow p-3 border rounded-md bg-muted/50 overflow-y-auto max-h-[40rem]">
              {isPending ? (
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground text-center">
                    Start typing your request to see suggested providers.
                    </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
