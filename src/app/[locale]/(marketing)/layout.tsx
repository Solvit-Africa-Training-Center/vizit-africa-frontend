import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/shared/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
