"use client";

import { Footer } from "@/components/landing";
import { Navbar } from "@/components/shared";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
