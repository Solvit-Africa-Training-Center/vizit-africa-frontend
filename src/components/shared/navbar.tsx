"use client";

import {
  RiCloseLine,
  RiDashboardLine,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiSuitcaseLine,
  RiUserLine,
} from "@remixicon/react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { logout } from "@/actions/auth";
import { TripRequestDialog } from "@/components/landing/trip-request-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/components/user-provider";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTripStore } from "@/store/trip-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { LanguageSwitcher } from "./language-switcher";
import Logo from "./logo";
import { NavbarMobile } from "./navbar-mobile";

interface NavbarProps {
  forceSolid?: boolean;
}

export function Navbar({ forceSolid = false }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const { user } = useUser();
  const hasActiveTrip = useTripStore((s) => s.hasActiveTrip());
  const tripItemCount = useTripStore((s) => s.itemCount());
  const isMounted = useIsMounted();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTripDialogOpen, setIsTripDialogOpen] = useState(false);
  const { scrollY } = useScroll();

  const heroRoutes = ["/"];
  const hasHero = heroRoutes.includes(pathname);
  const showSolid = forceSolid || isScrolled || !hasHero;

  const headerClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    showSolid
      ? "py-4 bg-primary-foreground/60 backdrop-blur-xl border-b border-black/5"
      : "py-6 bg-transparent",
  );

  const textColorClass = showSolid ? "text-primary" : "text-primary-foreground";

  const logoVariant = showSolid ? "default" : "light";

  const navLinks = [
    { href: "/services", label: t("ourservices") },
    { href: "/experiences", label: t("experiences") },
    { href: "/about", label: t("aboutUs") },
    { href: "/gallery", label: t("gallery") },
    { href: "/contact", label: t("contact") },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <motion.header
        className={headerClass}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          role="navigation"
          aria-label="Main Navigation"
          className="mx-auto max-w-[1400px] px-6 md:px-12 flex items-center justify-between"
        >
          <div className="shrink-0 w-[140px]">
            <Link href="/" aria-label="Vizit Africa Home">
              <div className="scale-90 origin-left transition-transform duration-500">
                <Logo variant={logoVariant} />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative group font-display font-medium uppercase tracking-[0.2em] text-xs transition-colors duration-300 drop-shadow-sm",
                    isActive
                      ? showSolid
                        ? "text-primary"
                        : "text-primary-foreground"
                      : showSolid
                        ? "text-foreground hover:text-primary"
                        : "text-primary-foreground hover:text-primary-foreground",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px transition-all duration-300 ease-out",
                      showSolid ? "bg-primary" : "bg-primary-foreground",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-6 justify-end">
            <LanguageSwitcher variant={showSolid ? "default" : "light"} />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="outline-none"
                  aria-label="User menu"
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70",
                      textColorClass,
                    )}
                  >
                    <Avatar>
                      <AvatarImage
                        src={(user as any).image || undefined}
                        alt={user.full_name}
                      />
                      <AvatarFallback className="bg-transparent text-current">
                        {user.full_name.split(" ")[0].charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2">
                  <DropdownMenuItem>
                    <Link
                      href="/profile"
                      className="flex items-center cursor-pointer w-full"
                    >
                      <RiUserLine className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem>
                      <Link
                        href="/admin"
                        className="flex items-center cursor-pointer w-full"
                      >
                        <RiDashboardLine className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <RiLogoutBoxRLine className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className={cn(
                  "font-display font-medium uppercase text-[11px] transition-opacity hover:opacity-70",
                  textColorClass,
                )}
              >
                {tCommon("login")}
              </Link>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      size="sm"
                      variant={showSolid ? "default" : "secondary"}
                      className={cn(
                        "rounded-sm font-display font-medium uppercase tracking-wider text-xs px-6 transition-all duration-300 gap-2",
                        !showSolid &&
                          "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
                      )}
                      onClick={() => setIsTripDialogOpen(true)}
                    />
                  }
                >
                  {isMounted ? (
                    hasActiveTrip ? (
                      <>
                        <RiSuitcaseLine className="size-4" />
                        {tripItemCount} {tripItemCount === 1 ? "item" : "items"}{" "}
                        · View Trip
                      </>
                    ) : (
                      tCommon("startPlanning")
                    )
                  ) : (
                    tCommon("startPlanning")
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Plan your dream trip to Africa</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TripRequestDialog
              open={isTripDialogOpen}
              onOpenChange={setIsTripDialogOpen}
            />
          </div>

          <button
            type="button"
            className={cn(
              "md:hidden p-2 transition-colors duration-200",
              textColorClass,
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <RiCloseLine className="size-6" />
            ) : (
              <RiMenuLine className="size-6" />
            )}
          </button>
        </nav>
      </motion.header>

      <NavbarMobile
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
