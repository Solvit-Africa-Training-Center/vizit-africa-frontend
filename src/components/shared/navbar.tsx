"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiMenuLine, RiCloseLine } from "@remixicon/react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
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
  const { scrollY } = useScroll();

  const heroRoutes = ["/"];

  const hasHero = heroRoutes.includes(pathname);
  const showSolid = forceSolid || isScrolled || !hasHero;

  const logoVariant = showSolid ? "default" : "light";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

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

          {/* desktop */}
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
            <Link
              href="/login"
              className={cn(
                "font-display font-medium uppercase tracking-widest text-xs transition-colors duration-200",
                showSolid
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white",
              )}
            >
              Log in
            </Link>
            <Link href="/plan-trip">
              <Magnetic>
                <Button
                  size="sm"
                  variant={showSolid ? "default" : "secondary"}
                  className={cn(
                    "rounded-sm font-display font-bold uppercase tracking-wider text-xs px-6 transition-all duration-300",
                    !showSolid && "bg-white text-primary hover:bg-white/90",
                  )}
                >
                  Start Planning
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
