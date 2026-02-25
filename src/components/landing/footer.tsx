"use client";

import {
  RiFacebookLine,
  RiInstagramLine,
  RiLinkedinLine,
  RiTwitterXLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/configs";
import { Logo } from "../shared";

const socialLinks = [
  { icon: RiTwitterXLine, href: siteConfig.socials.twitter, label: "Twitter" },
  {
    icon: RiInstagramLine,
    href: siteConfig.socials.instagram,
    label: "Instagram",
  },
  {
    icon: RiFacebookLine,
    href: siteConfig.socials.facebook,
    label: "Facebook",
  },
  {
    icon: RiLinkedinLine,
    href: siteConfig.socials.linkedin,
    label: "LinkedIn",
  },
];

export function Footer() {
  const t = useTranslations("Footer");

  const footerLinks = {
    services: [
      { label: t("links.tripsPackages"), href: "/experiences" },
      { label: t("links.customItineraries"), href: "/plan-trip" },
      { label: t("links.gallery"), href: "/gallery" },
      { label: t("links.faq"), href: "/#faq" },
    ],
    company: [
      { label: t("links.aboutUs"), href: "/about" },
      { label: t("links.contactUs"), href: "/contact" },
      { label: t("links.privacyPolicy"), href: "/privacy" },
      { label: t("links.termsOfService"), href: "/terms" },
      { label: t("links.requestVendorship"), href: "/partners/apply" },
    ],
    contact: [
      {
        label: siteConfig.contact.email,
        href: `mailto:${siteConfig.contact.email}`,
      },
      {
        label: siteConfig.contact.phone,
        href: `tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
      },
      {
        label: t("links.whatsapp"),
        href: `https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, "")}`,
      },
    ],
  };

  return (
    <footer
      id="main-footer"
      className="bg-surface-ink text-primary-foreground pt-24 pb-12 overflow-hidden relative isolate"
    >
      <div className="marketing-container relative z-20">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-24 mb-32">
          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-3 space-y-8">
            <Logo variant="light" />
            <p className="font-sans text-sm text-white/40 leading-relaxed max-w-[240px] font-light text-pretty">
              {t("tagline")}
            </p>
            <div className="space-y-1">
              <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
                Coordinates
              </p>
              <p className="font-mono text-xs text-primary">
                1°56'24.0"S 30°03'36.0"E
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="size-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group"
                >
                  <social.icon
                    className="size-4 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-20">
            <div>
              <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary font-bold mb-8">
                {t("explore")}
              </h4>
              <ul className="space-y-4">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-light text-white/40 hover:text-surface-cream transition-colors duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary font-bold mb-8">
                {t("company")}
              </h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-light text-white/40 hover:text-surface-cream transition-colors duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary font-bold mb-8">
                {t("contact")}
              </h4>
              <ul className="space-y-4">
                {footerLinks.contact.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-sm font-light text-white/40 hover:text-surface-cream transition-colors duration-300 inline-block truncate max-w-full"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} VIZIT AFRICA. ALL RIGHTS RESERVED.
          </p>
          <div className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">
            MADE WITH CARE IN KIGALI <span className="text-primary">✦</span>
          </div>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="font-mono text-[10px] text-white/30 hover:text-white uppercase tracking-[0.2em] transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="font-mono text-[10px] text-white/30 hover:text-white uppercase tracking-[0.2em] transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>

      {/* Ghost Wordmark */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10 select-none flex justify-center opacity-[0.02]">
        <span className="font-display font-bold text-[12vw] text-white whitespace-nowrap translate-y-1/4">
          VIZIT AFRICA
        </span>
      </div>
    </footer>
  );
}
