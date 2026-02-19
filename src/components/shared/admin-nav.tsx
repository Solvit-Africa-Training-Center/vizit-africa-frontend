"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiFileListLine,
  RiCalendarCheckLine,
  RiStackLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: RiDashboardLine },
  { href: "/admin/requests", label: "Requests", icon: RiFileListLine },
  { href: "/admin/bookings", label: "Bookings", icon: RiCalendarCheckLine },
  { href: "/admin/inventory", label: "Inventory", icon: RiStackLine },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
      {adminLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/admin" && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
