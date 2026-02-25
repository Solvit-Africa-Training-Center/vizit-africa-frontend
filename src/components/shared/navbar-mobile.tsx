"use client";

import { RiSuitcaseLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/user-provider";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTripStore } from "@/store/trip-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { LanguageSwitcher } from "./language-switcher";

interface NavbarMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavbarMobile({ isOpen, onClose }: NavbarMobileProps) {
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const { user } = useUser();
  const pathname = usePathname();
  const hasActiveTrip = useTripStore((s) => s.hasActiveTrip());
  const tripItemCount = useTripStore((s) => s.itemCount());
  const isMounted = useIsMounted();

  const navLinks = [
    { href: "/services", label: t("ourservices") },
    { href: "/experiences", label: t("experiences") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "md:hidden fixed inset-y-0 right-0 z-50 w-full sm:w-[380px] bg-surface-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] transition-opacity duration-500 sm:-translate-x-[380px] w-[100vw]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <div className="px-6 py-5 bg-surface-ink flex justify-between items-center shrink-0">
        <div className="font-display text-xl text-white font-semibold flex items-center gap-2">
          <span className="text-primary text-[10px]">✦</span> Vizit Africa
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Links */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="flex flex-col">
          {navLinks.map((link, index) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between py-4 border-b border-border-warm last:border-0 group transition-all"
                onClick={onClose}
              >
                <span
                  className={cn(
                    "font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-primary",
                    isActive ? "text-primary" : "text-surface-ink",
                  )}
                >
                  {link.label}
                </span>
                <span className="font-mono text-[10px] text-surface-ink/40 tracking-[0.1em]">
                  0{index + 1}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-[#f2ede6] shrink-0 border-t border-border-warm flex flex-col gap-3">
        <div className="flex justify-between items-center pb-2">
          <LanguageSwitcher />

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="font-mono text-[10px] text-red-700/70 tracking-[0.1em] uppercase hover:text-red-700 transition-colors"
            >
              Log Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="font-mono text-[10px] text-primary tracking-[0.1em] uppercase hover:text-primary/80 transition-colors"
            >
              Sign In →
            </Link>
          )}
        </div>

        {user && user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="w-full flex justify-center py-2 text-xs font-mono tracking-widest text-surface-ink/60 hover:text-surface-ink transition-colors"
            onClick={onClose}
          >
            Go to Admin Dashboard
          </Link>
        )}

        <Link href="/plan-trip" onClick={onClose} className="w-full">
          <Button
            size="lg"
            className="w-full h-12 rounded-full font-sans font-semibold uppercase tracking-[0.12em] text-[12px] text-white bg-primary hover:bg-primary/90 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            {isMounted ? (
              hasActiveTrip ? (
                <>
                  <RiSuitcaseLine className="size-4 mr-2" />
                  {tripItemCount} {tripItemCount === 1 ? "item" : "items"} ·
                  View Trip
                </>
              ) : (
                <>✦ {tCommon("startPlanning")}</>
              )
            ) : (
              <>✦ {tCommon("startPlanning")}</>
            )}
          </Button>
        </Link>

        <div className="flex justify-between items-center pt-2">
          <span className="font-mono text-[9px] text-surface-ink/40 tracking-[0.1em] uppercase">
            GMT+2 · Kigali, RW
          </span>
          {user && (
            <Link
              href="/profile"
              onClick={onClose}
              className="font-mono text-[9px] text-surface-ink/60 tracking-[0.1em] uppercase hover:text-primary"
            >
              {user.full_name}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
