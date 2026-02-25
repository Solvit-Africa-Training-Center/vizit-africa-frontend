import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Mono,
  DM_Sans,
  Inter,
  Noto_Sans_Arabic,
} from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { SmoothScroller } from "@/components/smooth-scroller";
import { DirectionProvider } from "@/components/ui/direction";
import { ScrollProgress } from "@/components/ui/scroll-progress";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vizit.africa"),
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getLocale();
  const direction = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={direction} suppressHydrationWarning>
      <body
        className={`${cormorantGaramond.variable} ${dmSans.variable} ${dmMono.variable} ${inter.variable} ${notoSansArabic.variable} font-sans antialiased`}
      >
        <DirectionProvider direction={direction}>
          <SmoothScroller>
            <ScrollProgress />
            {children}
          </SmoothScroller>
        </DirectionProvider>
      </body>
    </html>
  );
}
