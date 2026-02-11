"use client";

import { useState } from "react";
import {
  RiMenuLine,
  RiCloseLine,
  RiUserLine,
  RiLogoutBoxRLine,
  RiDashboardLine,
} from "@remixicon/react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { NavbarMobile } from "./navbar-mobile";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useUser } from "@/components/user-provider";
import { logout } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface NavbarProps {
  forceSolid?: boolean;
}

export function Navbar({ forceSolid = false }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const { user } = useUser();
  console.log({ user });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const heroRoutes = ["/"];
  const hasHero = heroRoutes.includes(pathname);
  const showSolid = forceSolid || isScrolled || !hasHero;
  const logoVariant = showSolid ? "default" : "light";

  const navLinks = [
    { href: "/services", label: t("services") },
    { href: "/experiences", label: t("experiences") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contact") },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          showSolid
            ? "bg-background/80 backdrop-blur-xl border-b border-border/40 py-4"
            : "bg-transparent py-6",
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="mx-auto max-w-7xl px-5 md:px-10 flex items-center justify-between">
          <Logo variant={logoVariant} />
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-display font-medium uppercase tracking-widest text-xs transition-colors duration-200",
                  showSolid
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/80 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher variant={showSolid ? "default" : "light"} />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-2 font-display font-medium uppercase tracking-widest text-xs transition-colors duration-200 cursor-pointer",
                        showSolid
                          ? "text-muted-foreground hover:text-foreground"
                          : "text-white/80 hover:text-white",
                      )}
                    />
                  }
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <RiUserLine className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden lg:inline">
                    {user.full_name.split(" ")[0]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/profile"
                        className="flex items-center gap-2"
                      />
                    }
                  >
                    <RiUserLine className="w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem
                      render={
                        <Link
                          href="/admin"
                          className="flex items-center gap-2"
                        />
                      }
                    >
                      <RiDashboardLine className="w-4 h-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
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
                  "font-display font-medium uppercase tracking-widest text-xs transition-colors duration-200",
                  showSolid
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/80 hover:text-white",
                )}
              >
                {tCommon("login")}
              </Link>
            )}

            <Link href="/plan-trip">
              <Magnetic>
                <Button
                  size="sm"
                  variant={showSolid ? "default" : "secondary"}
                  className={cn(
                    "rounded-sm font-display font-medium uppercase tracking-wider text-xs px-6 transition-all duration-300",
                    !showSolid && "bg-white text-primary hover:bg-white/90",
                  )}
                >
                  {tCommon("startPlanning")}
                </Button>
              </Magnetic>
            </Link>
          </div>
          <button
            type="button"
            className={cn(
              "md:hidden p-2 transition-colors duration-200 rounded-sm",
              showSolid
                ? "text-foreground hover:bg-muted"
                : "text-white hover:bg-white/10",
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <RiCloseLine
                className={cn(
                  "size-6",
                  showSolid ? "text-foreground" : "text-white",
                )}
              />
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
