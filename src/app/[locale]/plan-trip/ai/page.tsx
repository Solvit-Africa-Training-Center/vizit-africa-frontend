import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";
import AiTripClient from "./ai-client";

export default function AiTripPage() {
  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-background pt-32 pb-24 px-5 md:px-10">
        <PageHeader
          title="Intelligent Curation"
          overline="AI Assistant"
          description="Let our concierge AI craft your perfect African journey based on your unique preferences and style."
          className="mb-16"
        />
        <AiTripClient />
      </main>
    </>
  );
}
