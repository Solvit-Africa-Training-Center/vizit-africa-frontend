"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiMenuLine, RiCloseLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { navLinks } from "./nav-links";
import { NavbarMobile } from "./navbar-mobile";

interface NavbarProps {
  forceSolid?: boolean;
}

export function Navbar({ forceSolid = false }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const heroRoutes = [
    "/",
    "/experiences",
    "/gallery",
    "/about",
    "/contact",
    "/services",
  ];

  const hasHero = heroRoutes.includes(pathname);
  const showSolid = forceSolid || isScrolled || !hasHero;

  const logoVariant = showSolid ? "default" : "light";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          showSolid
            ? "bg-white/80 backdrop-blur-md border-b border-border/50 py-3 shadow-sm"
            : "bg-transparent py-6",
        )}
      >
        <nav className="mx-auto max-w-7xl px-5 md:px-10 flex items-center justify-between">
          <Logo variant={logoVariant} />

          {/* desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  showSolid
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/80 hover:text-white drop-shadow-sm",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* cta */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                showSolid
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white drop-shadow-sm",
              )}
            >
              Login
            </Link>
            <Link href="/plan-trip">
              <Button
                size="sm"
                variant={showSolid ? "default" : "secondary"}
                className={cn(
                  "rounded-full transition-all duration-300 font-medium",
                  !showSolid && "bg-white text-primary hover:bg-white/90",
                )}
              >
                Get Started
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className={cn(
              "md:hidden p-2 transition-colors duration-300 rounded-md",
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
      </header>

      <NavbarMobile
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
