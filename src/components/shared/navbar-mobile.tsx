"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navLinks } from "./nav-links";

interface NavbarMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavbarMobile({ isOpen, onClose }: NavbarMobileProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border animate-in slide-in-from-top-5 fade-in duration-200 fixed top-[72px] left-0 right-0 z-40">
      <div className="px-5 py-6 space-y-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block font-display font-medium uppercase tracking-widest text-sm text-foreground/80 hover:text-primary transition-colors py-2 border-b border-border/50 last:border-0"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
        <div className="pt-4 space-y-3">
          <Link
            href="/login"
            className="block text-center font-display font-medium uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground py-2"
            onClick={onClose}
          >
            Log in
          </Link>
          <Link href="/plan-trip" onClick={onClose} className="block">
            <Button
              size="lg"
              className="w-full rounded-sm font-display font-bold uppercase tracking-wider text-xs"
            >
              Start Planning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
