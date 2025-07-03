import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { ArrowRight } from 'lucide-react';
import { ServiceRequestForm } from '@/components/service-request-form';
import { ProviderCard } from '@/components/provider-card';
import { getProviders } from '@/lib/firestore';

export default async function Home() {
  const allProviders = await getProviders();
  const topProviders = allProviders.slice(0, 3);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8 pt-16 md:pt-24">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
                Connect with Local Pros, Effortlessly.
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Your one-stop solution to find trusted, local service providers for any job. Describe your need below or browse all providers.
            </p>
        </div>

        <div className="mt-12 w-full max-w-5xl">
            <ServiceRequestForm />
        </div>
        
        <section className="mt-24 w-full max-w-6xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">
                    Our Top Rated Providers
                </h2>
                <p className="mt-2 text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
                    Get inspired by our community's favorite professionals.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {topProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                ))}
            </div>
            <div className="mt-12 flex justify-center">
                <Button asChild size="lg">
                    <Link href="/services">
                        Browse All Providers
                        <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </section>

      </main>
    </div>
  );
}
