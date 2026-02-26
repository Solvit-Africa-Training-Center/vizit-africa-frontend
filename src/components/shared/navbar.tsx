"use client";

import {
  RiAddLine,
  RiLogoutBoxRLine,
  RiSuitcaseLine,
  RiUser3Line,
} from "@remixicon/react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TripRequestDialog } from "@/components/landing/trip-request-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTripStore } from "@/store/trip-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { useUser } from "@/components/user-provider";
import { logout } from "@/actions/auth";
import Logo from "./logo";
import { NavbarMobile } from "./navbar-mobile";

function HamburgerIcon({
  isOpen,
  isLight,
}: {
  isOpen: boolean;
  isLight: boolean;
}) {
  return (
    <div className="flex flex-col justify-center gap-[5px] w-5 h-5">
      <motion.span
        animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "block h-px rounded-full origin-center transition-colors duration-300",
          isLight ? "bg-white/70" : "bg-foreground/60",
        )}
        style={{ width: "100%" }}
      />
      <motion.span
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "block h-px rounded-full transition-colors duration-300",
          isLight ? "bg-white/70" : "bg-foreground/60",
        )}
        style={{ width: "70%" }}
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "block h-px rounded-full origin-center transition-colors duration-300",
          isLight ? "bg-white/70" : "bg-foreground/60",
        )}
        style={{ width: "100%" }}
      />
    </div>
  );
}

interface NavbarProps {
  forceSolid?: boolean;
}

export function Navbar({ forceSolid = false }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navigation");
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
  const showSolid = forceSolid || !hasHero || isScrolled;

  const isLight = !showSolid;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleLogout = async () => {
    await logout();
    router.refresh();
    router.push("/");
  };

  const navLinks = [
    { href: "/experiences", label: t("experiences") },
    { href: "/services", label: t("ourservices") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <>
      <motion.header
        className={cn(
          "top-0 left-0 right-0 z-50 flex justify-center",
          hasHero ? "fixed" : "absolute",
          "transition-[padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          showSolid ? "py-4 md:py-5" : "py-6 md:py-8",
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <nav
          aria-label="Main Navigation"
          className={cn(
            "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "w-full mx-auto",
            showSolid
              ? [
                  "max-w-[960px] rounded-full px-5",
                  "bg-card/92 backdrop-blur-2xl",
                  "border border-border/50",
                  "shadow-[0_4px_24px_oklch(0%_0_0/0.08),0_1px_4px_oklch(0%_0_0/0.04)]",
                  "py-2.5",
                ]
              : ["max-w-[1400px] px-6 bg-transparent py-1.5"],
          )}
        >
          <div className="grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* ── Logo ─────────────────────────────────────────────── */}
            <div className="flex justify-start">
              <Link
                href="/"
                aria-label="Vizit Africa Home"
                className="shrink-0 transition-opacity duration-300 hover:opacity-75 active:opacity-60"
              >
                <Logo variant={showSolid ? "default" : "light"} />
              </Link>
            </div>

            {/* ── Desktop nav links — centered ─────────────────────── */}
            <div className="hidden lg:flex items-center gap-9">
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
                      "relative group font-mono text-[10px] font-medium uppercase tracking-[0.18em]",
                      "transition-colors duration-300",
                      isLight
                        ? isActive
                          ? "text-white"
                          : "text-white/50 hover:text-white/85"
                        : isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                    {/* Active / hover underline */}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive ? "w-full" : "w-0 group-hover:w-full",
                        // Amber underline on hero transparent state, primary when solid
                        isLight ? "bg-primary" : "bg-primary",
                      )}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3 justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "rounded-full size-9 relative transition-all duration-300",
                          isLight
                            ? "text-white/60 hover:text-white hover:bg-white/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                        onClick={() => setIsTripDialogOpen(true)}
                      >
                        <RiSuitcaseLine className="size-[18px]" />
                        {isMounted && hasActiveTrip && tripItemCount > 0 && (
                          <span className="absolute top-1.5 right-1.5 flex size-3 items-center justify-center rounded-full bg-primary text-[7px] font-bold text-white ring-1 ring-white/20">
                            {tripItemCount}
                          </span>
                        )}
                        <span className="sr-only">View Trip</span>
                      </Button>
                    }
                  />
                  <TooltipContent
                    sideOffset={12}
                    className="bg-surface-ink text-white border-none rounded-xl px-4 py-2 text-[11px] font-mono shadow-2xl"
                  >
                    <p>{t("trip.tooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Separator
                orientation="vertical"
                className={cn(
                  "hidden lg:block h-4 transition-colors duration-300",
                  isLight ? "bg-white/15" : "bg-border",
                )}
              />

              <Button
                type="button"
                onClick={() => setIsTripDialogOpen(true)}
                variant={showSolid ? "default" : "ghost"}
                size={"sm"}
                className={cn(
                  showSolid ? "" : "text-white hover:bg-primary/60",
                )}
              >
                <RiAddLine className="size-3.5" />
                {t("planTrip") ?? "Plan Trip"}
              </Button>

              <div className="hidden lg:block">
                {isMounted && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                       
                          <Avatar className="h-full w-full">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                              {userInitials}
                            </AvatarFallback>
                          </Avatar>
                   
                      }
                    />
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-xs font-medium leading-none">
                            {user.fullName}
                          </p>
                          <p className="text-[10px] leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <Link href="/profile">
                        <DropdownMenuItem className="cursor-pointer">
                          <RiUser3Line className="mr-2 size-4" />
                          <span>{t("userMenu.profile")}</span>
                        </DropdownMenuItem>
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link href="/admin">
                          <DropdownMenuItem className="cursor-pointer">
                            <RiLogoutBoxRLine className="mr-2 size-4 rotate-180" />
                            <span>{t("userMenu.dashboard")}</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={handleLogout}
                      >
                        <RiLogoutBoxRLine className="mr-2 size-4" />
                        <span>{t("userMenu.logout")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  isMounted && (
                    <Link
                      href="/login"
                      className={cn(
                        "text-[10px] font-mono font-medium uppercase tracking-widest transition-colors",
                        isLight
                          ? "text-background/70 hover:text-background"
                          : "text-muted-foreground hover:text-primary",
                      )}
                    >
                      {t("signIn")}
                    </Link>
                  )
                )}
              </div>

              <button
                type="button"
                className={cn(
                  "lg:hidden flex items-center justify-center size-9 rounded-full",
                  "transition-all duration-300",
                  isLight ? "hover:bg-white/10" : "hover:bg-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                )}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <HamburgerIcon isOpen={isMobileMenuOpen} isLight={isLight} />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      <NavbarMobile
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <TripRequestDialog
        open={isTripDialogOpen}
        onOpenChange={setIsTripDialogOpen}
      />
    </>
  );
}
