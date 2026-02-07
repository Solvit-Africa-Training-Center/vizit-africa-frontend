"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiFileListLine,
  RiStoreLine,
  RiSettings3Line,
  RiLogoutBoxRLine,
  RiGlobalLine,
  RiCheckboxCircleLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: RiDashboardLine },
  { href: "/admin/requests", label: "Requests", icon: RiFileListLine },
  { href: "/admin/bookings", label: "Bookings", icon: RiCheckboxCircleLine },
  { href: "/admin/inventory", label: "Inventory", icon: RiStoreLine },
  { href: "/admin/settings", label: "Settings", icon: RiSettings3Line },
];

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center px-5 md:px-10">
        <div className="mr-8 hidden md:flex">
          <Link href="/admin" className="mr-6 flex items-center space-x-2">
            <span className="font-display text-xl font-bold text-primary">
              Vizit Admin
            </span>
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));

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

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <RiGlobalLine />
              <span className="hidden sm:inline">Public Site</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
          >
            <RiLogoutBoxRLine />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
