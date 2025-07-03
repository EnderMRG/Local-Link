import { ProviderList } from "@/components/provider-list";
import { Header } from "@/components/header";

export default function ServicesPage() {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="p-4 md:p-8">
        <ProviderList />
      </main>
    </div>
  );
}
