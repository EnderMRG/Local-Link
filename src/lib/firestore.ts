import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import type { Provider, UserProfile } from '@/types';
import type { User } from 'firebase/auth';

if (!db) {
  // This check is to prevent the app from crashing on the server if Firebase is not configured.
  // The UI will show a warning to the user.
  console.warn("Firebase is not configured. Firestore functionality will be disabled.");
}

// ============== Provider Functions ==============

export async function getProviders(): Promise<Provider[]> {
  if (!db) return [];
  try {
    const providersCol = collection(db, 'providers');
    const providerSnapshot = await getDocs(providersCol);
    const providerList = providerSnapshot.docs.map(doc => {
      const data = doc.data();
      if (data['data-ai-hint'] && !data.aiHint) {
        data.aiHint = data['data-ai-hint'];
        delete data['data-ai-hint'];
      }
      return { id: doc.id, ...data } as Provider;
    });
    return providerList;
  } catch (error) {
    console.error("Error fetching providers:", error);
    return [];
  }
}

export async function getProvider(id: string): Promise<Provider | null> {
  if (!db) return null;
  try {
    const providerRef = doc(db, 'providers', id);
    const providerSnap = await getDoc(providerRef);
    if (providerSnap.exists()) {
      const data = providerSnap.data();
      if (data['data-ai-hint'] && !data.aiHint) {
        data.aiHint = data['data-ai-hint'];
        delete data['data-ai-hint'];
      }
      return { id: providerSnap.id, ...data } as Provider;
    } else {
      console.log("No such provider document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching provider:", error);
    return null;
  }
}

// ============== User Functions ==============

export async function addUserToFirestore(user: User) {
    if (!db) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // Only create a new document if one doesn't already exist
    if (!userSnap.exists()) {
        const { uid, email, displayName, photoURL } = user;
        const newUser: UserProfile = {
            uid,
            email,
            displayName,
            photoURL
        };

        try {
            await setDoc(userRef, {
                ...newUser,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error creating user document in Firestore:", error);
        }
    }
}
