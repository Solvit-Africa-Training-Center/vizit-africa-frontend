"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RiMenuLine, RiCloseLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/experiences", label: "Experiences" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border py-3"
          : "bg-transparent py-5",
      )}
    >
      <nav className="mx-auto max-w-7xl px-5 md:px-10 flex items-center justify-between">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "font-display text-xl font-bold transition-colors duration-300",
              isScrolled ? "text-primary" : "text-white",
            )}
          >
            Vizit Africa
          </span>
        </Link>

        {/* desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                isScrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* cta button */}
        <div className="hidden md:block">
          <Link href="/plan-trip">
            <Button
              size="sm"
              variant={isScrolled ? "default" : "secondary"}
              className={cn(
                "rounded-full transition-all duration-300",
                !isScrolled && "bg-white text-primary hover:bg-white/90",
              )}
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* mobile menu button */}
        <button
          type="button"
          className={cn(
            "md:hidden p-2 transition-colors duration-300",
            isScrolled ? "text-foreground" : "text-white",
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <RiCloseLine className="size-6 text-foreground" />
          ) : (
            <RiMenuLine className="size-6" />
          )}
        </button>
      </nav>

      {/* mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="px-5 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/plan-trip" onClick={() => setIsMobileMenuOpen(false)}>
              <Button size="sm" className="w-full mt-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
