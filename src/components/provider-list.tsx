'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ProviderCard } from './provider-card';
import { getProviders } from '@/lib/firestore';
import type { Provider } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export function ProviderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const providers = await getProviders();
        setAllProviders(providers);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    if (!searchTerm.trim()) {
      return allProviders;
    }
    return allProviders.filter(
      (provider) =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allProviders]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-headline text-3xl font-bold">Find Local Pros</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or service (e.g., Plumbing)"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[225px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
      ) : filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/50 rounded-lg">
          <h3 className="font-headline text-xl">No providers found</h3>
          <p className="text-muted-foreground mt-2">Try a different search term, or add providers to your Firestore database.</p>
        </div>
      )}
    </div>
  );
}
