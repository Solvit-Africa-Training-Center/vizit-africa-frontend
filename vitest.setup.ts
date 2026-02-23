import { vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
  NextIntlProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock GSAP/ScrollTrigger
vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    ScrollTrigger: { enable: vi.fn(), register: vi.fn() },
  },
  registerPlugin: vi.fn(),
  ScrollTrigger: { enable: vi.fn(), register: vi.fn() },
}));

// Mock matchMedia for jsdom
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };
  };
