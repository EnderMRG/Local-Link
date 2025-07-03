import { Header } from '@/components/header';
import { getProvider, getProviders } from '@/lib/firestore';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateStaticParams() {
  const providers = await getProviders();
 
  return providers.map((provider) => ({
    id: provider.id,
  }));
}

export default async function ProviderProfilePage(props: { params: { id: string } }) {
  const provider = await getProvider(props.params.id);

  if (!provider) {
    notFound();
  }
  
  const isValidUrl = provider.image && (provider.image.startsWith('http://') || provider.image.startsWith('https://'));

  return (
    <div className="min-h-screen w-full bg-muted/20">
      <Header />
      <main className="p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="p-0">
              <div className="relative h-64 w-full">
                {provider.image && (
                  <Image
                    src={isValidUrl ? provider.image : 'https://placehold.co/600x400.png'}
                    alt={provider.name}
                    fill
                    className="object-cover"
                    data-ai-hint={provider.aiHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-4xl font-bold font-headline">{provider.name}</h1>
                  <div className="flex items-center flex-wrap gap-4 mt-2">
                    <Badge variant="default" className="text-md px-4 py-1">{provider.service}</Badge>
                    {provider.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium">{provider.location}</span>
                        </div>
                    )}
                    {provider.verified && (
                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-5 h-5" />
                            <span>Verified</span>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div>
                    <h2 className="text-2xl font-bold font-headline border-b pb-2 mb-4">About {provider.name}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                    {provider.description}
                    </p>
                </div>
                
                {provider.skills && provider.skills.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold font-headline border-b pb-2 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {provider.skills.map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                )}
                
                {provider.reviews && provider.reviews.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold font-headline border-b pb-2 mb-4">Reviews</h2>
                        <div className="space-y-4">
                            {provider.reviews.map((review, index) => (
                                <Card key={index} className="bg-muted/30">
                                    <CardContent className="p-4">
                                        <div className="flex items-center mb-2">
                                            <div className="flex text-yellow-500">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <p className="ml-auto text-sm font-semibold text-foreground">{review.author}</p>
                                        </div>
                                        <p className="text-muted-foreground italic">"{review.comment}"</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-xl font-bold font-headline mb-2">Our Commitment</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        We are dedicated to providing the highest quality service and customer satisfaction. Our team is fully licensed, insured, and committed to professional excellence. We use only the best materials and techniques to ensure a job well done, every time. Your trust is our most valued asset.
                    </p>
                </div>
              </div>
              <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Community Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-yellow-500 mb-2">
                            <Star className="w-6 h-6 fill-current" />
                            <span className="font-bold text-2xl text-foreground">{provider.rating}</span>
                            <span className="text-sm text-muted-foreground mt-1">/ 5.0</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Based on {provider.reviews?.length || 'verified'} customer reviews.</p>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Contact Provider</CardTitle>
                    </CardHeader>
                     <CardContent className="flex flex-col gap-2">
                        <Button className="w-full" disabled={!provider.contact?.email}>
                            <Mail className="mr-2" /> Message
                        </Button>
                        <Button variant="outline" className="w-full" disabled={!provider.contact?.phone}>
                            <Phone className="mr-2" /> Call Now
                        </Button>
                     </CardContent>
                 </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
