'use server';
/**
 * @fileOverview Recommends a service provider based on user input.
 *
 * - recommendProvider - A function that handles the provider recommendation.
 * - RecommendProviderInput - The input type for the recommendProvider function.
 * - RecommendProviderOutput - The return type for the recommendProvider function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getProviders } from '@/lib/firestore';
import type { Provider } from '@/types';

const ProviderSchema = z.object({
    id: z.string(),
    name: z.string(),
    service: z.string(),
    description: z.string(),
    rating: z.number(),
    image: z.string(),
    aiHint: z.string(),
    location: z.string().describe("The location or city where the provider operates.").optional(),
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

const RecommendProviderInputSchema = z.string();
export type RecommendProviderInput = z.infer<typeof RecommendProviderInputSchema>;

const RecommendProviderOutputSchema = z.object({
  responseText: z.string().describe("The AI's conversational response to the user."),
  recommendedProvider: ProviderSchema.optional().describe("The provider recommended by the AI, if any.")
});
export type RecommendProviderOutput = z.infer<typeof RecommendProviderOutputSchema>;

const findProvidersTool = ai.defineTool(
    {
        name: 'findProviders',
        description: 'Searches the real-time provider database for service providers based on a service type like "plumbing" or "gardening".',
        inputSchema: z.object({
            serviceQuery: z.string().describe("The type of service to search for.")
        }),
        outputSchema: z.array(ProviderSchema),
    },
    async (input) => {
        const providers = await getProviders();
        const query = input.serviceQuery.toLowerCase();
        return providers.filter(p => p.service.toLowerCase().includes(query));
    }
);

export async function recommendProvider(input: RecommendProviderInput): Promise<RecommendProviderOutput> {
  return recommendProviderFlow(input);
}

const recommendProviderFlow = ai.defineFlow(
  {
    name: 'recommendProviderFlow',
    inputSchema: RecommendProviderInputSchema,
    outputSchema: RecommendProviderOutputSchema,
  },
  async (userInput) => {
    const llmResponse = await ai.generate({
        prompt: `You are a helpful AI assistant for "Local Link", a service that connects users with local professionals. Your goal is to understand the user's request, find a suitable service provider using the available tools, and recommend one to the user in a friendly and conversational manner. The provider data is sourced from a live database.

        User Request: "${userInput}"
        
        If you find a suitable provider, introduce them and explain why they are a good fit. If you cannot find a provider, apologize and ask the user for more details or to try a different service type.
        `,
        tools: [findProvidersTool],
        output: {
            schema: RecommendProviderOutputSchema,
        }
    });

    const output = llmResponse.output;
    if (!output) {
      throw new Error("Failed to get a response from the AI.");
    }
    return output;
  }
);
