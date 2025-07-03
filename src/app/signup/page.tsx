
import { SignUpForm } from "@/components/signup-form";
import { Header } from "@/components/header";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 bg-muted/40">
        <SignUpForm />
      </main>
    </div>
  );
}
