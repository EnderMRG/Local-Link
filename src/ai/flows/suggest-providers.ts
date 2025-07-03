'use server';

/**
 * @fileOverview Suggests relevant service providers based on a request description.
 *
 * - suggestProviders - A function that suggests providers based on description.
 * - SuggestProvidersInput - The input type for the suggestProviders function.
 * - SuggestProvidersOutput - The return type for the suggestProviders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getProviders } from '@/lib/firestore';

const SuggestProvidersInputSchema = z.object({
  requestDescription: z
    .string()
    .describe('The description of the service request.'),
});
export type SuggestProvidersInput = z.infer<typeof SuggestProvidersInputSchema>;

// The schema for a single provider.
const ProviderSchema = z.object({
    id: z.string(),
    name: z.string(),
    service: z.string(),
    description: z.string(),
    rating: z.number(),
    image: z.string(),
    aiHint: z.string(),
    location: z.string().optional(),
    contact: z.object({
        phone: z.string(),
        email: z.string(),
    }).optional(),
    verified: z.boolean().optional(),
    reviews: z.array(z.object({
        rating: z.number(),
        comment: z.string(),
        author: z.string(),
    })).optional(),
    skills: z.array(z.string()).optional(),
}).catchall(z.any());

// The output from the flow will be a list of full provider objects.
const SuggestProvidersOutputSchema = z.object({
  suggestedProviders: z.array(ProviderSchema),
});
export type SuggestProvidersOutput = z.infer<typeof SuggestProvidersOutputSchema>;

// The LLM will just return the names.
const SuggestProviderNamesOutputSchema = z.object({
    suggestedProviders: z.array(z.string()).describe('A list of suggested provider names based on the user request. Only use names from the provided list.'),
});


export async function suggestProviders(input: SuggestProvidersInput): Promise<SuggestProvidersOutput> {
  return suggestProvidersFlow(input);
}

const SuggestProvidersPromptInputSchema = z.object({
  requestDescription: z.string(),
  providers: z.array(
    z.object({
      name: z.string(),
      service: z.string(),
      description: z.string(),
      location: z.string().optional(),
    })
  ),
});

const prompt = ai.definePrompt({
  name: 'suggestProvidersPrompt',
  input: {schema: SuggestProvidersPromptInputSchema},
  output: {schema: SuggestProviderNamesOutputSchema},
  prompt: `You are an AI assistant helping a user find a service provider.
Based on the user's request, suggest up to 3 relevant providers from the list below.
The list of available providers is sourced directly from our live database.
Only suggest providers from this list. Do not make up providers.
Return just the names of the suggested providers in the 'suggestedProviders' array.

Available Providers:
{{#each providers}}
- Name: {{this.name}}, Service: {{this.service}}, Location: {{this.location}}, Description: {{this.description}}
{{/each}}

User's Service Request:
"{{{requestDescription}}}"
`,
});

const suggestProvidersFlow = ai.defineFlow(
  {
    name: 'suggestProvidersFlow',
    inputSchema: SuggestProvidersInputSchema,
    outputSchema: SuggestProvidersOutputSchema,
  },
  async input => {
    const providers = await getProviders();

    if (providers.length === 0) {
        return { suggestedProviders: [] };
    }

    const {output} = await prompt({
      ...input,
      providers: providers.map(p => ({
        name: p.name,
        service: p.service,
        description: p.description,
        location: p.location,
      })),
    });

    if (!output?.suggestedProviders) {
        return { suggestedProviders: [] };
    }

    // Find the full provider objects based on the suggested names from the LLM.
    const suggestedProviderObjects = providers.filter(p => output.suggestedProviders.includes(p.name));
    
    return { suggestedProviders: suggestedProviderObjects };
  }
);
