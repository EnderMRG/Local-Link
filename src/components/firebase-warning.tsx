'use client';

import { useAuth } from '@/context/auth-context';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function FirebaseWarning() {
    const { firebaseConfigured } = useAuth();

    if (firebaseConfigured) {
        return null;
    }

    return (
        <div className="p-4">
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Firebase Not Configured</AlertTitle>
                <AlertDescription>
                    Authentication is disabled. Please add your Firebase project credentials to the 
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold mx-1">.env</code> 
                    file to enable login and sign-up functionality.
                </AlertDescription>
            </Alert>
        </div>
    );
}
