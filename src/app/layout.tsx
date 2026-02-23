import type { Metadata } from "next";
import {
  DM_Sans,
  Inter,
  JetBrains_Mono,
  Noto_Sans_Arabic,
} from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { SmoothScroller } from "@/components/smooth-scroller";
import { DirectionProvider } from "@/components/ui/direction";
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
        className={`${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoSansArabic.variable} font-sans antialiased`}
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
