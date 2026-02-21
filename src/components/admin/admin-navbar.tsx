"use client";

import {
  RiAddLine,
  RiArrowDownSLine,
  RiCheckboxCircleLine,
  RiDashboardLine,
  RiFileListLine,
  RiLogoutBoxRLine,
  RiServiceLine,
  RiSettings3Line,
  RiStoreLine,
  RiUserStarLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "../shared/language-switcher";

export function AdminNavbar() {
  const pathname = usePathname();
  const t = useTranslations("Admin.nav");
  const tAdmin = useTranslations("Admin");

  const adminLinks = [
    { href: "/admin", label: t("overview"), icon: RiDashboardLine },
    { href: "/admin/requests", label: t("requests"), icon: RiFileListLine },
    {
      href: "/admin/bookings",
      label: t("bookings"),
      icon: RiCheckboxCircleLine,
    },
    { href: "/admin/inventory", label: t("inventory"), icon: RiStoreLine },
    { href: "/admin/vendors", label: t("vendors"), icon: RiUserStarLine },
    { href: "/admin/settings", label: t("settings"), icon: RiSettings3Line },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center px-5 md:px-10">
        <div className="mr-8 hidden md:flex">
          <Link href="/admin" className="mr-6 flex items-center space-x-2">
            <span className="font-display text-xl font-medium text-primary">
              {t("brand")}
            </span>
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname?.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 transition-colors hover:text-foreground/80",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-foreground/60",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden md:inline-block">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm" className="gap-2 h-9 px-3">
                  <RiAddLine className="size-4" />
                  <span className="hidden sm:inline font-medium">
                    {t("create")}
                  </span>
                  <RiArrowDownSLine className="size-4 opacity-50" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <Link href="/admin/create/service">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <RiServiceLine className="size-4" />
                  <span>{tAdmin("createService.title")}</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/create/vendor">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <RiUserStarLine className="size-4" />
                  <span>{tAdmin("createVendor.title")}</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <LanguageSwitcher variant={"default"} />
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <span className="hidden sm:inline">{t("publicSite")}</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={async () => {
              try {
                await import("@/actions/auth").then((mod) => mod.logout());
                window.location.href = "/auth/login";
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
          >
            <RiLogoutBoxRLine />
            <span className="sr-only">{t("logout")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
