"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useUser } from "@/components/user-provider";
import { logout } from "@/actions/auth";
import {
  RiUserLine,
  RiLogoutBoxRLine,
  RiDashboardLine,
} from "@remixicon/react";

interface NavbarMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavbarMobile({ isOpen, onClose }: NavbarMobileProps) {
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const { user } = useUser();

  const navLinks = [
    { href: "/services", label: t("services") },
    { href: "/experiences", label: t("experiences") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border animate-in slide-in-from-top-5 fade-in duration-200 fixed top-[72px] left-0 right-0 z-40">
      <div className="px-5 py-6 space-y-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block font-display font-medium uppercase tracking-widest text-sm text-foreground/80 hover:text-primary transition-colors py-2 border-b border-border/50 last:border-0"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
        <div className="pt-4 space-y-3 border-t border-border/50">
          <div className="flex justify-center py-2">
            <LanguageSwitcher />
          </div>

          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center justify-center gap-2 font-display font-medium uppercase tracking-widest text-xs text-foreground hover:text-primary py-2"
                onClick={onClose}
              >
                <RiUserLine className="w-4 h-4" />
                {user.full_name.split(" ")[0]}
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 font-display font-medium uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground py-2"
                  onClick={onClose}
                >
                  <RiDashboardLine className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-sm font-display font-medium uppercase tracking-wider text-xs"
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
              >
                <RiLogoutBoxRLine className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-center font-display font-medium uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground py-2"
                onClick={onClose}
              >
                {tCommon("login")}
              </Link>
              <Link href="/plan-trip" onClick={onClose} className="block">
                <Button
                  size="lg"
                  className="w-full rounded-sm font-display font-medium uppercase tracking-wider text-xs"
                >
                  {tCommon("startPlanning")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
