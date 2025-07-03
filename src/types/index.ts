export type Provider = {
  id: string;
  name: string;
  service: string;
  description: string;
  rating: number;
  image: string;
  aiHint: string;
  location?: string;
  contact?: {
    phone: string;
    email: string;
  };
  verified?: boolean;
  reviews?: {
    rating: number;
    comment: string;
    author: string;
  }[];
  skills?: string[];
};

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
}
