"use client";

import { RiAddLine, RiSuitcaseLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/services", label: t("services") },
    { href: "/experiences", label: t("experiences") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] transition-opacity duration-500 ease-in-out",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 right-0 z-[60] w-full sm:w-[380px] bg-surface-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-surface-ink flex justify-between items-center shrink-0">
          <div className="font-display text-xl text-white font-semibold flex items-center gap-2">
            <RiAddLine className="text-primary size-4" /> Vizit Africa
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                  className="flex items-center justify-between py-5 border-b border-border-warm last:border-0 group transition-all"
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
        <div className="p-6 bg-[#f2ede6] shrink-0 border-t border-border-warm flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2">
            <LanguageSwitcher />

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                className="font-mono text-[10px] text-red-700/70 tracking-[0.1em] uppercase hover:text-red-700 transition-colors p-2"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="font-mono text-[10px] text-primary tracking-[0.1em] uppercase hover:text-primary/80 transition-colors p-2"
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
              className="w-full h-14 rounded-full font-sans font-semibold uppercase tracking-[0.12em] text-[12px] text-white bg-primary hover:bg-primary/90 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {isMounted ? (
                hasActiveTrip ? (
                  <>
                    <RiSuitcaseLine className="size-4 mr-2" />
                    {tripItemCount} {tripItemCount === 1 ? "item" : "items"} ·
                    View Trip
                  </>
                ) : (
                  <>
                    <RiAddLine className="size-4 mr-2" />
                    {tCommon("startPlanning")}
                  </>
                )
              ) : (
                <>
                  <RiAddLine className="size-4 mr-2" />
                  {tCommon("startPlanning")}
                </>
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
                className="flex items-center gap-2 group"
              >
                <span className="font-mono text-[9px] text-surface-ink/60 tracking-[0.1em] uppercase group-hover:text-primary transition-colors">
                  {user.fullName}
                </span>
                <Avatar className="size-8 border border-border-warm">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {user.fullName
                      ? user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "??"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
