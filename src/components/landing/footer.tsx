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
        <div className="grid md:grid-cols-12 gap-12 lg:gap-24 mb-28">
          {/* ── Brand column ─────────────────────────────────────── */}
          <div className="md:col-span-4 lg:col-span-3 space-y-8">
            <Logo variant="light" />
            <p className="font-sans text-sm text-white/35 leading-relaxed max-w-[240px] font-light text-pretty">
              {t("tagline")}
            </p>
            {/* Coordinates block — data feel */}
            <div className="space-y-1.5">
              <p className="font-mono text-[9px] text-primary uppercase tracking-[0.2em]">
                {t("coordinates")}
              </p>
              <p className="font-mono text-[11px] text-white/40 tracking-wide">
                1°56′24.0″S 30°03′36.0″E
              </p>
              <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">
                GMT+2 · CAT · Kigali, RW
              </p>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={[
                    "size-9 flex items-center justify-center rounded-full",
                    "border border-white/[0.08] text-white/35",
                    "hover:border-primary/40 hover:text-primary-foreground",
                    "transition-all duration-300 group",
                  ].join(" ")}
                >
                  <social.icon
                    className="size-3.5 group-hover:scale-110 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ─────────────────────────────────────── */}
          <div className="md:col-span-8 lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-20">
            {/* Explore */}
            <div>
              {/* ✦ Column title in primary per design guide */}
              <h4 className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-medium mb-7">
                {t("explore")}
              </h4>
              <ul className="space-y-3.5">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-light text-white/35 hover:text-white/75 transition-colors duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-medium mb-7">
                {t("company")}
              </h4>
              <ul className="space-y-3.5">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-light text-white/35 hover:text-white/75 transition-colors duration-300 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary font-medium mb-7">
                {t("contact")}
              </h4>
              <ul className="space-y-3.5">
                {footerLinks.contact.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-sm font-light text-white/35 hover:text-white/75 transition-colors duration-300 inline-block truncate max-w-full"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <div className="pt-7 border-t border-white/[0.07] flex flex-col md:flex-row items-center justify-between gap-5 relative z-20">
          <p className="font-mono text-[9.5px] text-white/20 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Vizit Africa. {t("allRightsReserved")}
          </p>
          <div className="font-mono text-[9.5px] text-white/20 tracking-[0.15em] uppercase">
            {t("madeWithCare")}&nbsp;
            <span className="text-primary">✦</span>
          </div>
          <div className="flex gap-7">
            <Link
              href="/privacy"
              className="font-mono text-[9.5px] text-white/20 hover:text-white/55 uppercase tracking-[0.18em] transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="font-mono text-[9.5px] text-white/20 hover:text-white/55 uppercase tracking-[0.18em] transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Ghost wordmark — barely visible, editorial depth ──────── */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10 select-none flex justify-center"
        aria-hidden="true"
      >
        <span className="font-display font-bold text-[12vw] text-white whitespace-nowrap translate-y-1/4 opacity-[0.025]">
          VIZIT AFRICA
        </span>
      </div>
    </footer>
  );
}
