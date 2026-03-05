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
        <div className="flex md:hidden mr-4">
          <Link href="/admin">
            <span className="font-display text-lg font-bold text-primary">VA</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-2 flex-1 overflow-x-auto no-scrollbar py-1 mr-2 sm:mr-4">
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
                  "flex items-center gap-2 px-3 py-2 rounded-full transition-all whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-3.5 sm:size-4" />
                <span className="hidden lg:inline-block">{link.label}</span>
                {/* Show label on tablet/mobile if space allows, but keep it tight */}
                <span className="inline-block lg:hidden">
                  {link.label === t("overview") ? "" : link.label.slice(0, 3)}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm" className="size-9 p-0 sm:w-auto sm:px-3 sm:gap-2 rounded-full">
                  <RiAddLine className="size-4" />
                  <span className="hidden xl:inline font-bold text-[10px] uppercase tracking-widest">
                    {t("create")}
                  </span>
                  <RiArrowDownSLine className="size-3 opacity-50 hidden sm:inline" />
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
            <Button variant="ghost" size="sm" className="size-9 p-0 sm:w-auto sm:px-3 text-muted-foreground rounded-full">
              <RiStoreLine className="size-4 sm:hidden" />
              <span className="hidden sm:inline font-bold text-[10px] uppercase tracking-widest">{t("publicSite")}</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-muted-foreground hover:text-destructive"
            onClick={async () => {
              try {
                await import("@/actions/auth").then((mod) => mod.logout());
                window.location.href = "/auth/login";
              } catch (error) {
                // Logout error handled
              }
            }}
          >
            <RiLogoutBoxRLine className="size-4" />
            <span className="sr-only">{t("logout")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
