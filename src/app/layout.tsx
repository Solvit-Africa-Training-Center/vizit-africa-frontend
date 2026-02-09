import type { Metadata } from "next";
import { DM_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroller } from "@/components/smooth-scroller";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vizit Africa | Your Journey to Rwanda Starts Here",
  description:
    "Professional travel planning for your Rwanda experience. Flights, hotels, car rentals, and local guides - all in one place.",
  keywords: [
    "Rwanda travel",
    "Kigali",
    "gorilla trekking",
    "Africa tours",
    "Rwanda hotels",
    "Rwanda flights",
  ],
  openGraph: {
    title: "Vizit Africa | Your Journey to Rwanda Starts Here",
    description:
      "Professional travel planning for your Rwanda experience. Flights, hotels, car rentals, and local guides.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <SmoothScroller>
          <CustomCursor />
          <ScrollProgress />
          {children}
        </SmoothScroller>
      </body>
    </html>
  );
}
